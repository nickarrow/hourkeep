/**
 * Income Tracking Types
 *
 * TypeScript interfaces for income tracking feature.
 * Supports income-based compliance as alternative to hours tracking.
 */

// Income Entry
export interface IncomeEntry {
  id?: number; // Auto-increment ID
  userId: string; // Link to user profile
  date: string; // YYYY-MM-DD format
  amount: number; // Dollar amount (e.g., 150.50)
  payPeriod: "daily" | "weekly" | "bi-weekly" | "monthly";
  monthlyEquivalent: number; // Calculated based on pay period
  source?: string; // Optional: employer/source name
  incomeType?: "wages" | "self-employment" | "gig-work" | "tips" | "other"; // Type of earned income
  createdAt: Date;
  updatedAt: Date;
}

// Seasonal Worker Status (stored per user per month)
export interface SeasonalWorkerStatus {
  id?: number;
  userId: string;
  month: string; // YYYY-MM format
  isSeasonalWorker: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Income Document (similar to Activity Document)
export interface IncomeDocument {
  id?: number;
  incomeEntryId: number; // Link to income entry
  blobId: number; // Link to blob storage
  type: "pay_stub" | "bank_statement" | "app_screenshot" | "other";
  customType?: string; // If type is "other"
  description?: string;
  fileSize: number; // Original file size in bytes
  compressedSize?: number; // Compressed size if compression was applied
  mimeType: "image/jpeg" | "image/png";
  captureMethod: "camera" | "upload";
  createdAt: Date;
}

// Income Document Blob (similar to Activity Document Blob)
export interface IncomeDocumentBlob {
  id?: number;
  blob: Blob;
  createdAt: Date;
}

// Compliance Mode (track user's choice per month)
export interface ComplianceMode {
  id?: number;
  userId: string;
  month: string; // YYYY-MM format
  mode: "hours" | "income";
  createdAt: Date;
  updatedAt: Date;
}

// Monthly Income Summary (calculated, not stored)
export interface MonthlyIncomeSummary {
  month: string; // YYYY-MM format
  // W7a (gap 5.5): the SUM OF ACTUAL AMOUNTS received this month, not of per-paycheck
  // monthly projections. 42 CFR 435.552(f)(2), 91 FR 33470 — MAGI-based monthly income.
  totalIncome: number;
  entryCount: number; // Number of income entries
  isCompliant: boolean; // effective income >= threshold. NAME IS A VERDICT — W7b renames it with MonthlySummary.isCompliant (ADR-0003)
  amountNeeded: number; // threshold - effective income (if below)
  isSeasonalWorker: boolean; // If this month is marked seasonal for the user
  // 42 CFR 435.552(g): average over the 6 months PRECEDING the assessed month (excluded).
  seasonalAverage?: number;
  // W7a (gap 5.9): `hasData` distinguishes a month with no record from a $0 month, so the
  // UI never presents an imputed $0 as verified.
  seasonalHistory?: Array<{ month: string; total: number; hasData: boolean }>;
  // W7a (gap 5.9): how many of the 6 window months hold records — lets the UI flag an
  // incomplete history rather than dividing a thin history by 6.
  seasonalMonthsWithData?: number;
  // W7a (gap 5.5): breakdown by source of ACTUAL amounts received, not projections.
  incomeBySource?: Array<{ source: string; amount: number }>;
}
