// Document Types

export type DocumentType =
  | "pay-stub"
  | "volunteer-verification"
  | "school-enrollment"
  | "medical-documentation"
  // W6a (gap 8.4): CMS names these among reasonably-available documents —
  // § II.I.3 / § II.I.6, 91 FR 33399. New VALUES in the already-indexed documents.type
  // field, so no schema change (db.ts).
  | "va-disability"
  | "snap-tanf-approval"
  | "other";

// Document Metadata
export interface Document {
  id?: number; // Auto-increment ID
  /**
   * Foreign key to the activities table. Optional as of W8a (gap 8.5): a document may
   * instead attach to an exclusion-screening response via `exemptionId`. Exactly one of
   * `activityId` / `exemptionId` is set. The `activityId` index in db.ts simply has no
   * value for an exclusion document, which Dexie permits — so this is a TYPE change, not a
   * schema change, and needs no version bump (.kiro/steering/data-migration-standards.md).
   */
  activityId?: number;
  /**
   * Foreign key to the exemptions (exclusion-screening) table — W8a, gap 8.5.
   * 42 CFR 435.557(b)(2), 91 FR 33395: a VA letter, a school record, or a SNAP/TANF
   * approval notice is documentation of a specified-excluded-individual status, which the
   * state must accept. Unindexed nested data on an existing row — no new index, no bump.
   * The package iterates all documents once and partitions in memory, so no query index is
   * needed; adding one would trigger the eight-document renumber (a deliberate decision).
   */
  exemptionId?: number;
  type: DocumentType; // Type of document
  customType?: string; // If type is "other"
  description?: string; // Optional description (max 200 chars)
  originalFileName?: string; // Original file name
  fileSize: number; // Size in bytes
  compressedSize?: number; // Size after compression (if compressed)
  mimeType: string; // image/jpeg or image/png
  captureMethod: "camera" | "upload"; // How document was added
  createdAt: Date; // When document was created
  blobId: number; // Foreign key to documentBlobs table
}

// Document Blob
export interface DocumentBlob {
  id?: number; // Auto-increment ID
  blob: Blob; // The actual image data
  createdAt: Date; // When blob was stored
}
