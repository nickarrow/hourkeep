/**
 * Type-aware copying of an activity's evidence fields — one place, so create, edit,
 * multi-date save, and duplicate cannot diverge.
 *
 * W6a convergence (semantic review finding 6): duplication copied only `type`, `hours`, and
 * the legacy `organization`, dropping `workKind`, every community-service verification
 * field, and all education source facts. A duplicated community-service entry lost its
 * confirming contact; a duplicated education entry lost the status that gives it meaning.
 *
 * This copies exactly the W6a source fields that belong to the activity's type and nothing
 * else, so a duplicate carries the evidence forward without smuggling fields across a type.
 */

import type { Activity } from "@/types";

/**
 * The W6a evidence fields of `source` that are relevant to its type, ready to spread into a
 * new activity. Excludes `id`, `date`, `createdAt`, `updatedAt` — the caller sets those.
 */
export function copyEvidenceFields(source: Activity): Partial<Activity> {
  switch (source.type) {
    case "work":
      return { workKind: source.workKind };
    case "education":
      return {
        enrollmentStatus: source.enrollmentStatus,
        educationProgramType: source.educationProgramType,
        creditHours: source.creditHours,
        nonCreditHours: source.nonCreditHours,
      };
    case "volunteer":
      return {
        organization: source.organization,
        communityService: source.communityService,
      };
    case "workProgram":
      return {};
  }
}
