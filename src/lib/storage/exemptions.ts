import { db } from "@/lib/db";
import {
  ExemptionScreening,
  ExemptionResponses,
  ExemptionResult,
  ExemptionHistory,
} from "@/types/exemptions";
import { deleteDocumentsByExemption } from "@/lib/storage/documents";

/**
 * Save a completed exemption screening
 * @param userId - User profile ID
 * @param responses - User's responses to screening questions
 * @param result - Calculated exemption result
 * @returns The saved screening record with ID
 */
export async function saveScreening(
  userId: string,
  responses: ExemptionResponses,
  result: ExemptionResult,
): Promise<ExemptionScreening> {
  try {
    const screening: ExemptionScreening = {
      userId,
      screeningDate: new Date(),
      responses,
      result,
      version: 1, // Current screening logic version
    };

    const id = await db.exemptions.add(screening);
    return { ...screening, id };
  } catch (error) {
    console.error("Error saving exemption screening:", error);
    throw new Error("Failed to save exemption screening");
  }
}

/**
 * Get the most recent exemption screening for a user
 * @param userId - User profile ID
 * @returns The latest screening record, or undefined if none exists
 */
export async function getLatestScreening(
  userId: string,
): Promise<ExemptionScreening | undefined> {
  try {
    const screenings = await db.exemptions
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("screeningDate");

    return screenings[0];
  } catch (error) {
    console.error("Error getting latest screening:", error);
    throw new Error("Failed to retrieve exemption screening");
  }
}

/**
 * Get all historical exemption screenings for a user
 * @param userId - User profile ID
 * @returns Array of historical screening records, sorted by date (newest first)
 */
export async function getScreeningHistory(
  userId: string,
): Promise<ExemptionHistory[]> {
  try {
    const history = await db.exemptionHistory
      .where("userId")
      .equals(userId)
      .reverse()
      .sortBy("screeningDate");

    return history;
  } catch (error) {
    console.error("Error getting screening history:", error);
    throw new Error("Failed to retrieve screening history");
  }
}

/**
 * Delete an exclusion screening together with any documents attached to it — W8a, gap 8.5.
 *
 * Exclusion documents (`exemptionId` on a `Document` row) must not survive the screening
 * they belong to, or their blobs orphan. `.kiro/steering/data-migration-standards.md`:
 * deletes cascade explicitly. Documents first, screening last, and the screening is NOT
 * deleted if any document failed — mirroring `deleteActivityWithDocuments` so a user left
 * with a visible error can retry rather than lose the handle to unreachable blobs.
 *
 * @param screeningId - ID of the screening to remove.
 * @throws If any attached document could not be deleted; the screening is left in place.
 */
export async function deleteExclusionScreeningWithDocuments(
  screeningId: number,
): Promise<void> {
  try {
    // Documents first — if this throws (naming how many failed), the screening survives.
    await deleteDocumentsByExemption(screeningId);
    await db.exemptions.delete(screeningId);
  } catch (error) {
    console.error("Error deleting exclusion screening with documents:", error);
    throw error;
  }
}

/**
 * Archive a screening to history and remove it from current screenings
 * Used when user re-screens
 * @param screeningId - ID of the screening to archive
 */
export async function archiveScreening(screeningId: number): Promise<void> {
  try {
    const screening = await db.exemptions.get(screeningId);

    if (!screening) {
      throw new Error("Screening not found");
    }

    // Add to history
    const historyRecord: ExemptionHistory = {
      userId: screening.userId,
      screeningDate: screening.screeningDate,
      isExempt: screening.result.isExempt,
      exemptionCategory: screening.result.exemptionCategory,
    };

    await db.exemptionHistory.add(historyRecord);

    // Remove from current screenings
    await db.exemptions.delete(screeningId);
  } catch (error) {
    console.error("Error archiving screening:", error);
    throw new Error("Failed to archive exemption screening");
  }
}
