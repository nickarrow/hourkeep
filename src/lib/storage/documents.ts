import { db } from "@/lib/db";
import { Document, DocumentBlob } from "@/types/documents";

/** The metadata a caller supplies — the storage layer owns id/blobId/createdAt and the FK. */
type DocumentMetadata = Omit<
  Document,
  "id" | "blobId" | "createdAt" | "activityId" | "exemptionId"
>;

/**
 * Shared write: enforce the storage-quota guard and persist blob + metadata atomically.
 *
 * The foreign key (`activityId` OR `exemptionId`) is passed through in `link`, so the
 * two public wrappers below differ only in which key they set. Both writes land in ONE
 * transaction — W0 § 0.6: a metadata failure must roll the blob back, or it is orphaned,
 * invisible to the UI, and unreachable by every delete path (which all start from the
 * metadata row). `.kiro/steering/data-migration-standards.md`: orphaned blobs are invisible
 * and unbounded.
 */
async function saveDocumentRow(
  link: { activityId: number } | { exemptionId: number },
  blob: Blob,
  metadata: DocumentMetadata,
): Promise<number> {
  // Check storage quota
  const quota = await navigator.storage.estimate();
  const available = (quota.quota || 0) - (quota.usage || 0);
  const availableMB = Math.floor(available / (1024 * 1024));

  if (available < 50 * 1024 * 1024) {
    // Less than 50MB available
    throw new Error(
      `Insufficient storage space. Only ${availableMB}MB available. Please delete some old documents to free up space.`,
    );
  }

  // Check if the blob itself would fit
  if (blob.size > available) {
    throw new Error(
      `Document is too large for available storage (${availableMB}MB available). Please delete some old documents first.`,
    );
  }

  return db.transaction("rw", db.documentBlobs, db.documents, async () => {
    const blobId = await db.documentBlobs.add({
      blob,
      createdAt: new Date(),
    });

    return db.documents.add({
      ...metadata,
      ...link,
      blobId,
      createdAt: new Date(),
    });
  });
}

/**
 * Save a document linked to an activity.
 * @param activityId - ID of the activity to link the document to
 * @param blob - The image blob to store
 * @param metadata - Document metadata (without id, blobId, createdAt, foreign keys)
 * @returns The ID of the saved document
 */
export async function saveDocument(
  activityId: number,
  blob: Blob,
  metadata: DocumentMetadata,
): Promise<number> {
  try {
    return await saveDocumentRow({ activityId }, blob, metadata);
  } catch (error) {
    console.error("Error saving document:", error);
    throw error;
  }
}

/**
 * Save a document linked to an exclusion-screening response — W8a, gap 8.5.
 *
 * 42 CFR 435.557(b)(2), 91 FR 33395: documentation of a specified-excluded-individual
 * status (a VA letter, a school record, a SNAP/TANF approval notice) is evidence the state
 * must accept. Before W8a a document could only attach to an activity, so none of this
 * could be captured or exported. Same atomic write and quota guard as the activity path;
 * the row carries `exemptionId` instead of `activityId` (unindexed — no schema change).
 *
 * @param exemptionId - ID of the exclusion screening to link the document to
 * @param blob - The image blob to store
 * @param metadata - Document metadata (without id, blobId, createdAt, foreign keys)
 * @returns The ID of the saved document
 */
export async function saveExclusionDocument(
  exemptionId: number,
  blob: Blob,
  metadata: DocumentMetadata,
): Promise<number> {
  try {
    return await saveDocumentRow({ exemptionId }, blob, metadata);
  } catch (error) {
    console.error("Error saving exclusion document:", error);
    throw error;
  }
}

/**
 * Get all documents linked to a specific exclusion screening — W8a, gap 8.5.
 *
 * `exemptionId` is unindexed by design (no new index → no Dexie bump), so this filters in
 * memory rather than using `.where()`. The exclusion-document count per screening is tiny
 * (a handful of letters), so a table scan here is cheaper than the index would cost.
 */
export async function getDocumentsByExemption(
  exemptionId: number,
): Promise<Document[]> {
  try {
    return await db.documents
      .filter((doc) => doc.exemptionId === exemptionId)
      .toArray();
  } catch (error) {
    console.error("Error getting documents by exemption:", error);
    throw error;
  }
}

/**
 * Get all documents for a specific activity
 * @param activityId - ID of the activity
 * @returns Array of documents
 */
export async function getDocumentsByActivity(
  activityId: number,
): Promise<Document[]> {
  try {
    const documents = await db.documents
      .where("activityId")
      .equals(activityId)
      .toArray();
    return documents;
  } catch (error) {
    console.error("Error getting documents by activity:", error);
    throw error;
  }
}

/**
 * Get a single document by ID
 * @param documentId - ID of the document
 * @returns The document or undefined if not found
 */
export async function getDocument(
  documentId: number,
): Promise<Document | undefined> {
  try {
    const document = await db.documents.get(documentId);
    return document;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

/**
 * Delete a document and its associated blob
 * @param documentId - ID of the document to delete
 */
export async function deleteDocument(documentId: number): Promise<void> {
  try {
    // Get the document to find the blobId
    const document = await db.documents.get(documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    // Delete the blob
    await db.documentBlobs.delete(document.blobId);

    // Delete the document metadata
    await db.documents.delete(documentId);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

/**
 * Delete every document (and its blob) linked to an exclusion screening — W8a, gap 8.5.
 *
 * The cascade a screening delete needs so exclusion documents do not become orphaned blobs
 * when the screening they belong to is removed. Mirrors the ordering contract of
 * `deleteActivityWithDocuments` / `deleteIncomeEntryWithDocuments`: documents first, and if
 * any fails the error names how many, so the caller can decide whether to remove the parent.
 *
 * @throws If any attached document could not be deleted. The message names how many failed.
 */
export async function deleteDocumentsByExemption(
  exemptionId: number,
): Promise<void> {
  const documents = await getDocumentsByExemption(exemptionId);
  const failed: number[] = [];

  for (const doc of documents) {
    if (doc.id !== undefined) {
      try {
        await deleteDocument(doc.id);
      } catch (docError) {
        console.error(
          `Failed to delete exclusion document ${doc.id}:`,
          docError,
        );
        failed.push(doc.id);
      }
    }
  }

  if (failed.length > 0) {
    throw new Error(
      `Failed to delete ${failed.length} document(s) for this screening.`,
    );
  }
}

/**
 * Get a document blob by blob ID
 * @param blobId - ID of the blob
 * @returns The document blob or undefined if not found
 */
export async function getDocumentBlob(
  blobId: number,
): Promise<DocumentBlob | undefined> {
  try {
    const documentBlob = await db.documentBlobs.get(blobId);
    return documentBlob;
  } catch (error) {
    console.error("Error getting document blob:", error);
    throw error;
  }
}
