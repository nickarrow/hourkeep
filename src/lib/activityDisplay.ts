/**
 * Display labels and colours for activity types — one source, so a new type cannot be
 * labelled in one component and left raw in another.
 *
 * W6a added `workProgram` to `Activity["type"]` (42 CFR 435.552(a)(3)). Before this file,
 * labels/colours were duplicated across `ActivityList`, `DateActivityMenu` and
 * `buildTextReport`; `DateActivityMenu` rendered the raw union value through a
 * `textTransform: capitalize`, so `workProgram` would have shown as "WorkProgram". A
 * `Record<Activity["type"], …>` makes the compiler require every type to be labelled.
 *
 * These are display strings, not domain claims — no verdict, no threshold. The full
 * definitions and citations live in `src/content/helpText.ts`.
 */

import type { Activity } from "@/types";

export const ACTIVITY_TYPE_LABELS: Record<Activity["type"], string> = {
  work: "Work",
  volunteer: "Community Service",
  education: "Education",
  // 42 CFR 435.552(a)(3). "Job Training" reads plainer than "work program"; the help text
  // carries the formal term and the five-program closed list.
  workProgram: "Job Training",
};

export const ACTIVITY_TYPE_CHIP_COLORS: Record<
  Activity["type"],
  "primary" | "success" | "info" | "warning"
> = {
  work: "primary",
  volunteer: "success",
  education: "info",
  // `warning` (amber) rather than `secondary`: the secondary palette tone measured 2.23:1
  // against the white paper, under the 3:1 WCAG 1.4.11 floor component-standards.md sets for
  // status chips (W6a convergence review finding 16). The theme's `warning.main` clears it.
  workProgram: "warning",
};

/**
 * The organization/source label to display for an activity — W6a.
 *
 * A community-service row now stores its organization in
 * `communityService.organizationName`, not the legacy free-text `organization`. The four
 * display surfaces (list, date menu, duplicate dialog, export) read `organization`, so
 * without this helper a new volunteer entry's organization name would show nowhere — a
 * regression caught by the convergence review (finding 5). Falls back to `organization` for
 * pre-W6a rows and for the non-volunteer types that still use it.
 */
export function activityOrganizationLabel(
  activity: Activity,
): string | undefined {
  return activity.communityService?.organizationName ?? activity.organization;
}
