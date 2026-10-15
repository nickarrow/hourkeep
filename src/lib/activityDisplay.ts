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
  "primary" | "success" | "info" | "secondary"
> = {
  work: "primary",
  volunteer: "success",
  education: "info",
  workProgram: "secondary",
};
