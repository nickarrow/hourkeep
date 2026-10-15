/**
 * What the review period is anchored on — W5 (ADR-0005).
 *
 * 42 CFR 435.556(a) measures every review period from a specific month, and nothing
 * in HourKeep stored one. `monthsRequired` is a count with no month attached, and
 * `deadline` is when a notice must be answered, which is not a month under review.
 *
 * Deriving the months from `deadline` was considered and rejected: it would mean
 * inferring the notice date, then the assessed months, when § 435.556(a)(2) forbids
 * states from dictating *which* months count and § 435.556(d) and § 435.558 both
 * require the state to name them. That would be invention presented as computation.
 * So the user tells us, or the app says it does not know.
 *
 * STORED HERE ON PURPOSE, AND IT IS NOT A SCHEMA CHANGE. `db.ts:39` declares
 * `profiles: "id"`, so `id` is the only indexed property and `onboardingContext` is
 * unindexed nested data that Dexie stores as part of the row. Adding an optional
 * field needs no `.stores()` change and no version bump — which matters because
 * `.kiro/steering/data-migration-standards.md` assigns v7 to W3. Old profiles simply
 * lack the field, which is the "add the new shape, leave old rows alone" pattern.
 */
export interface ReviewPeriodAnchor {
  /**
   * Which of 42 CFR 435.556(a)'s contexts the user is in.
   *
   * `application` derives exactly — § 435.556(a)(1)'s months immediately preceding.
   * `renewal` derives from an assumed renewal frequency and is much softer; see
   * `renewalReviewPeriodEndingAt` in `@/lib/reviewPeriod`.
   */
  kind: "application" | "renewal";
  /**
   * `YYYY-MM`. The month of application, or the month the renewal is due.
   * In both cases the month the period is measured *from*, not a month inside it —
   * § 435.556(a)(1) excludes the application month.
   */
  month: string;
}

// Onboarding Context
export interface OnboardingContext {
  hasNotice?: boolean; // Whether user received a notice
  monthsRequired?: number; // Number of months user needs to document (1-6)
  deadline?: Date; // Deadline for responding to notice
  completedAt?: Date; // When onboarding was completed
  /** W5: what the review period is measured from, if the user has told us. */
  reviewPeriodAnchor?: ReviewPeriodAnchor;
}

// User Profile
export interface UserProfile {
  id: string; // UUID
  name: string; // User's name
  state: string; // State abbreviation (e.g., "CA")
  dateOfBirth: string; // Encrypted ISO date string (required)
  medicaidId?: string; // Encrypted, optional
  phoneNumber?: string; // Optional, formatted
  email?: string; // Optional
  createdAt: Date; // When profile was created
  updatedAt: Date; // When profile was last updated
  privacyNoticeAcknowledged: boolean; // Must be true
  privacyNoticeAcknowledgedAt: Date; // When acknowledged
  version: number; // Profile schema version (for migrations)
  onboardingContext?: OnboardingContext; // Optional onboarding context
}

/**
 * The three sub-kinds of work — 42 CFR 435.552(b), 91 FR 33470.
 *
 * "Work" means work for money, work in exchange for goods or services ("in-kind"), and
 * unpaid work other than community service. All three count toward the 80-hour work
 * pathway; the distinction is captured because documentation expectations differ, and
 * in-kind and unpaid are exactly the cases CMS acknowledges documentation may not exist
 * for (91 FR 33355). `undefined` on a work row means the sub-kind was not recorded — most
 * naturally paid employment, but not assumed.
 */
export type WorkKind = "paid" | "in-kind" | "unpaid";

/**
 * Enrollment status for an education activity — 42 CFR 435.552(c), 91 FR 33470.
 *
 * Mirrors `EnrollmentStatus` in `@/lib/education` and is stored on the activity so the
 * half-time cliff survives a round-trip. The school determines status; `"unknown"` is a
 * real value, not a gap to fill in. See `src/lib/education.ts`.
 */
export type ActivityEnrollmentStatus =
  | "at-least-half-time"
  | "less-than-half-time"
  | "unknown";

/** Which kind of educational program — 42 CFR 435.552(b), 91 FR 33470. */
export type EducationProgramType =
  | "higher-education"
  | "career-technical"
  | "high-school"
  | "high-school-equivalency";

/**
 * A structured community-service record — 42 CFR 435.552(b) and § II.I.6.b, 91 FR 33400.
 *
 * The free-text `organization` field alone will not satisfy a verification request. CMS's
 * verification guidance (91 FR 33400) names: the organization's name and address; the type
 * and a description of the activity; the dates and hours; and the name and contact
 * (phone and/or email) of a point of contact "who can confirm the hours completed". Court-
 * ordered service counts and the organization need not be a § 501(c)(3) (91 FR 33356).
 *
 * All fields optional at the storage layer so a record can be started with just hours and
 * a date (progressive disclosure); the UI surfaces what is still missing for the record to
 * be verification-ready. Stored as unindexed nested data on the Activity row — no schema
 * change (see `db.ts`).
 */
export interface CommunityServiceDetails {
  organizationName?: string;
  organizationAddress?: string;
  pointOfContactName?: string;
  pointOfContactPhone?: string;
  pointOfContactEmail?: string;
  activityDescription?: string;
  /** 42 CFR 435.552(b): voluntary OR court-ordered — both count. */
  courtOrdered?: boolean;
}

// Activity
export interface Activity {
  id?: number; // Auto-increment ID
  date: string; // YYYY-MM-DD format
  // 42 CFR 435.552(a): the four hours-based pathways. `workProgram` added in W6a — a new
  // VALUE in the already-indexed `type` field (db.ts), not a new field, so no migration.
  type: "work" | "volunteer" | "education" | "workProgram";
  hours: number; // 0-24
  organization?: string; // Optional: where they worked (legacy free-text; superseded for community service by communityService)
  /** Work sub-kind — 42 CFR 435.552(b). Only meaningful when `type === "work"`. */
  workKind?: WorkKind;
  /** Enrollment status — 42 CFR 435.552(c). Only meaningful when `type === "education"`. */
  enrollmentStatus?: ActivityEnrollmentStatus;
  /** Program type — 42 CFR 435.552(b). Only meaningful when `type === "education"`. */
  educationProgramType?: EducationProgramType;
  /** Credit hours this month — used for less-than-half-time credit-based education. */
  creditHours?: number;
  /** Structured community-service record — only meaningful when `type === "volunteer"`. */
  communityService?: CommunityServiceDetails;
  createdAt: Date; // When entry was created
  updatedAt: Date; // When entry was last modified
}

// Monthly Summary (Calculated, not stored)
export interface MonthlySummary {
  month: string; // YYYY-MM format
  totalHours: number; // Sum of all hours
  workHours: number; // Sum of work hours
  volunteerHours: number; // Sum of volunteer hours
  educationHours: number; // Sum of education hours (less-than-half-time only; see src/lib/education.ts)
  workProgramHours: number; // Sum of work-program hours — 42 CFR 435.552(a)(3)
  isCompliant: boolean; // totalHours >= threshold. NAME IS A VERDICT — renamed meetsHoursThreshold in W7b (ADR-0003). No production reader; see wave-6a notes.
  hoursNeeded: number; // threshold - totalHours (if not compliant)
}
