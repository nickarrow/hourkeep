"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Badge,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Chip,
  FormHelperText,
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarTodayIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { ActivityFormHelp } from "@/components/activities/ActivityFormHelp";
import {
  Activity,
  WorkKind,
  ActivityEnrollmentStatus,
  EducationProgramType,
  CommunityServiceDetails,
} from "@/types";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityDisplay";
import { educationContribution } from "@/lib/education";
import { FEDERAL_DEFAULT } from "@/lib/policy";
import { Document } from "@/types/documents";
import { DocumentCapture } from "@/components/documents/DocumentCapture";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { DocumentMetadataFormSimple } from "@/components/documents/DocumentMetadataFormSimple";
import { DocumentVerificationHelpIcon } from "@/components/help/DocumentVerificationHelp";
import {
  getDocumentsByActivity,
  getDocumentBlob,
  deleteDocument,
} from "@/lib/storage/documents";

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    activity: Omit<Activity, "id" | "createdAt" | "updatedAt">,
  ) => Promise<number | void>;
  onDelete?: () => void;
  selectedDate: Date | null;
  existingActivity?: Activity;
}

export function ActivityForm({
  open,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  existingActivity,
}: ActivityFormProps) {
  const [type, setType] = useState<Activity["type"]>("work");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [organization, setOrganization] = useState("");
  // W6a: 42 CFR 435.552(b) work sub-kind, (c)/(d) education status, (b) community service.
  const [workKind, setWorkKind] = useState<WorkKind | "">("");
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    ActivityEnrollmentStatus | ""
  >("");
  const [educationProgramType, setEducationProgramType] = useState<
    EducationProgramType | ""
  >("");
  // 42 CFR 435.552(d)(1) credit programs vs (d)(2) non-credit programs — different
  // less-than-half-time arithmetic (convert vs count 1:1).
  const [educationBasis, setEducationBasis] = useState<"credit" | "non-credit">(
    "credit",
  );
  const [creditHours, setCreditHours] = useState("");
  const [communityService, setCommunityService] =
    useState<CommunityServiceDetails>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Ref for the hidden date input
  const additionalDateInputRef = useRef<HTMLInputElement>(null);

  // Document state for new entries
  const [pendingDocument, setPendingDocument] = useState<{
    blob: Blob;
    type: string;
    customType?: string;
    description?: string;
  } | null>(null);
  const [showDocumentCapture, setShowDocumentCapture] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);

  // Document display state for existing entries
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentUrls, setDocumentUrls] = useState<Map<number, string>>(
    new Map(),
  );
  const [viewingDocumentId, setViewingDocumentId] = useState<number | null>(
    null,
  );

  // Initialize form with existing activity or selected date
  useEffect(() => {
    if (existingActivity) {
      setType(existingActivity.type);
      setHours(existingActivity.hours.toString());
      setDate(existingActivity.date);
      setDates([existingActivity.date]);
      setOrganization(existingActivity.organization || "");
      setWorkKind(existingActivity.workKind ?? "");
      // Existing education rows have hours and no status (resolved-blockers item 3):
      // treat a missing status as "unknown" and ask, never infer it from hours.
      setEnrollmentStatus(
        existingActivity.type === "education"
          ? (existingActivity.enrollmentStatus ?? "unknown")
          : (existingActivity.enrollmentStatus ?? ""),
      );
      setEducationProgramType(existingActivity.educationProgramType ?? "");
      setEducationBasis(
        existingActivity.nonCreditHours !== undefined ? "non-credit" : "credit",
      );
      setCreditHours(
        existingActivity.creditHours !== undefined
          ? existingActivity.creditHours.toString()
          : "",
      );
      // A non-credit education row stores its class hours in nonCreditHours.
      if (existingActivity.nonCreditHours !== undefined) {
        setHours(existingActivity.nonCreditHours.toString());
      }
      setCommunityService(existingActivity.communityService ?? {});

      // Load documents for existing activity
      if (existingActivity.id) {
        loadDocuments(existingActivity.id);
      }
    } else if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      setDate(dateStr);
      setDates([dateStr]);
    }
  }, [existingActivity, selectedDate]);

  // Load documents for existing activity
  const loadDocuments = async (activityId: number) => {
    try {
      const docs = await getDocumentsByActivity(activityId);
      setDocuments(docs);

      // Load document blobs and create URLs
      const urls = new Map<number, string>();
      for (const doc of docs) {
        const blobData = await getDocumentBlob(doc.blobId);
        if (blobData) {
          const url = URL.createObjectURL(blobData.blob);
          urls.set(doc.id!, url);
        }
      }
      setDocumentUrls(urls);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  // Cleanup document URLs on unmount
  useEffect(() => {
    return () => {
      documentUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documentUrls]);

  /**
   * At-least-half-time education demonstrates on its own with ZERO hours —
   * 42 CFR 435.552(a)(4). So this entry is not an hours entry at all; the hours field is
   * hidden and no hours are required or stored.
   */
  const isHalfTimeStandalone =
    type === "education" && enrollmentStatus === "at-least-half-time";

  /** Less-than-half-time credit-based education: credit hours drive the figure (§ 435.552(d)(1)). */
  const isCreditBasedEducation =
    type === "education" &&
    enrollmentStatus === "less-than-half-time" &&
    educationBasis === "credit";

  /** Less-than-half-time non-credit education: actual class/activity hours count 1:1 (§ 435.552(d)(2)). */
  const isNonCreditEducation =
    type === "education" &&
    enrollmentStatus === "less-than-half-time" &&
    educationBasis === "non-credit";

  /**
   * The hours figure to store for this entry. For at-least-half-time education it is 0
   * (the demonstration is the enrolment, not any hours). For less-than-half-time
   * credit-based education it is the converted figure (42 CFR 435.552(d)). Otherwise the
   * number the user typed.
   */
  const resolvedHours = (): number => {
    // Education stores source facts (enrollmentStatus + creditHours/nonCreditHours), and
    // calculateMonthlySummary derives the monthly contribution — so the stored `hours` is
    // not the figure that counts. Keep it 0 for every education row to avoid caching a
    // value that could go stale against the policy conversion (W6a convergence, finding 3).
    if (type === "education") return 0;
    return parseFloat(hours) || 0;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasWarnings = false;

    // 42 CFR 435.552(c): the school assigns enrollment status. Require it to be chosen.
    if (type === "education" && !enrollmentStatus) {
      newErrors.enrollmentStatus =
        "Choose your enrollment status, or 'I'm not sure' to check with your school";
    }

    const educationNeedsNoHours =
      type === "education" &&
      (isHalfTimeStandalone || enrollmentStatus === "unknown");

    if (educationNeedsNoHours) {
      // No hours to validate. At-least-half-time counts on its own (a)(4); unknown status
      // means we store nothing and prompt the user to ask the school (c).
    } else if (isCreditBasedEducation) {
      // Credit hours drive the figure for less-than-half-time credit programs (d)(1).
      if (!creditHours || parseFloat(creditHours) <= 0) {
        newErrors.creditHours =
          "Enter your credit hours, or switch to class hours above";
      }
    } else {
      // Hours validation (work, community service, work program, non-credit education)
      if (!hours || parseFloat(hours) <= 0) {
        newErrors.hours = "Hours must be greater than 0";
      } else {
        const hoursValue = parseFloat(hours);

        if (hoursValue > 24) {
          newErrors.hours = "Hours cannot exceed 24 per day";
        } else if (hoursValue > 16) {
          setWarningMessage(
            "This is a lot of hours for one day. Please double-check.",
          );
          hasWarnings = true;
        }
      }
    }

    // Date validation
    if (!date && dates.length === 0) {
      newErrors.date = "At least one date is required";
    }

    setErrors(newErrors);

    // Show warning if there are warnings but no errors
    if (hasWarnings && Object.keys(newErrors).length === 0) {
      setShowWarning(true);
    }

    return Object.keys(newErrors).length === 0;
  };

  /**
   * The W6a fields to persist, built once so create / edit / multi-date / duplicate cannot
   * diverge. EXHAUSTIVE and type-aware: every W6a field is set to a value or explicitly to
   * `undefined`, so an edit that changes an activity's type CLEARS the fields that no longer
   * belong to it. A Dexie `update` merges, so omitting a key would leave a stale
   * `communityService` or `creditHours` behind (W6a convergence review, finding 5).
   *
   * Education stores SOURCE FACTS, not a cached converted figure: `enrollmentStatus` plus
   * either `creditHours` or `nonCreditHours`. `calculateMonthlySummary` derives the monthly
   * contribution from these (finding 3), so a changed policy conversion recomputes old rows.
   */
  const extraFields = (): Partial<Activity> => {
    const cs: CommunityServiceDetails | undefined = (() => {
      if (type !== "volunteer") return undefined;
      const details: CommunityServiceDetails = {
        organizationName:
          communityService.organizationName?.trim() || undefined,
        organizationAddress:
          communityService.organizationAddress?.trim() || undefined,
        pointOfContactName:
          communityService.pointOfContactName?.trim() || undefined,
        pointOfContactPhone:
          communityService.pointOfContactPhone?.trim() || undefined,
        pointOfContactEmail:
          communityService.pointOfContactEmail?.trim() || undefined,
        activityDescription:
          communityService.activityDescription?.trim() || undefined,
        courtOrdered: communityService.courtOrdered || undefined,
      };
      return Object.values(details).some((v) => v !== undefined)
        ? details
        : undefined;
    })();

    return {
      workKind: type === "work" && workKind ? workKind : undefined,
      enrollmentStatus:
        type === "education" && enrollmentStatus ? enrollmentStatus : undefined,
      educationProgramType:
        type === "education" && educationProgramType
          ? educationProgramType
          : undefined,
      creditHours:
        type === "education" && isCreditBasedEducation && creditHours
          ? parseFloat(creditHours)
          : undefined,
      nonCreditHours:
        type === "education" &&
        isNonCreditEducation &&
        hours &&
        parseFloat(hours) > 0
          ? parseFloat(hours)
          : undefined,
      communityService: cs,
    };
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      // If editing existing activity
      if (existingActivity) {
        await onSave({
          date,
          type,
          hours: resolvedHours(),
          organization: organization.trim() || undefined,
          ...extraFields(),
        });

        // If there's a pending document, save it
        if (pendingDocument && existingActivity.id) {
          const { saveDocument } = await import("@/lib/storage/documents");
          const { compressForStorage } = await import(
            "@/lib/utils/imageCompression"
          );

          // Compresses above 5MB and REFUSES anything still over 10MB. That
          // second check existed only in the dead DocumentMetadataForm; W0 § 0.4
          // rescued it into compressForStorage before deleting that file.
          const { blob: finalBlob, compressedSize } = await compressForStorage(
            pendingDocument.blob,
          );

          await saveDocument(existingActivity.id, finalBlob, {
            type: pendingDocument.type as Document["type"],
            customType: pendingDocument.customType,
            description: pendingDocument.description,
            fileSize: pendingDocument.blob.size,
            compressedSize,
            mimeType: pendingDocument.blob.type as "image/jpeg" | "image/png",
            captureMethod: "camera",
          });
        }
      } else {
        // Creating new activity/activities
        const datesToCreate = dates.length > 0 ? dates : [date];

        // Import db directly to batch save without triggering reload each time
        const { db } = await import("@/lib/db");
        let firstActivityId: number | undefined;

        // Save all activities in batch
        for (const dateStr of datesToCreate) {
          const activityId = await db.activities.add({
            date: dateStr,
            type,
            hours: resolvedHours(),
            organization: organization.trim() || undefined,
            ...extraFields(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Store the first activity ID for document attachment
          if (!firstActivityId) {
            firstActivityId = activityId;
          }
        }

        // If there's a pending document, attach it to the first entry
        if (pendingDocument && firstActivityId) {
          const { saveDocument } = await import("@/lib/storage/documents");
          const { compressForStorage } = await import(
            "@/lib/utils/imageCompression"
          );

          // Compresses above 5MB and REFUSES anything still over 10MB. That
          // second check existed only in the dead DocumentMetadataForm; W0 § 0.4
          // rescued it into compressForStorage before deleting that file.
          const { blob: finalBlob, compressedSize } = await compressForStorage(
            pendingDocument.blob,
          );

          await saveDocument(firstActivityId, finalBlob, {
            type: pendingDocument.type as Document["type"],
            customType: pendingDocument.customType,
            description: pendingDocument.description,
            fileSize: pendingDocument.blob.size,
            compressedSize,
            mimeType: pendingDocument.blob.type as "image/jpeg" | "image/png",
            captureMethod: "camera",
          });
        }
      }

      // Close the form immediately
      handleClose();

      // Manually reload activities after batch save
      if (!existingActivity) {
        // Trigger a page reload by dispatching a custom event
        window.dispatchEvent(new CustomEvent("activities-updated"));
      }
    } catch (error) {
      console.error("Error saving activity:", error);

      let errorMessage = "Failed to save activity. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("storage")) {
          errorMessage = "Storage error. Your device may be out of space.";
        }
      }

      setErrors({ submit: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  // Document handlers for new entries
  const handleAddDocumentClick = () => {
    setShowDocumentCapture(true);
  };

  const handleDocumentCaptured = (blob: Blob) => {
    setCapturedBlob(blob);
    setShowDocumentCapture(false);
    setShowMetadataForm(true);
  };

  const handleMetadataSavedForNew = (metadata: {
    type: string;
    customType?: string;
    description?: string;
  }) => {
    if (capturedBlob) {
      setPendingDocument({
        blob: capturedBlob,
        type: metadata.type,
        customType: metadata.customType,
        description: metadata.description,
      });
    }
    setShowMetadataForm(false);
    setCapturedBlob(null);
  };

  const handleRemovePendingDocument = () => {
    setPendingDocument(null);
  };

  // Document handlers for existing entries
  const handleAddDocumentToExisting = () => {
    setShowDocumentCapture(true);
  };

  const handleDocumentCapturedForExisting = async (blob: Blob) => {
    if (!existingActivity?.id) return;
    setCapturedBlob(blob);
    setShowDocumentCapture(false);
    setShowMetadataForm(true);
  };

  const handleMetadataSaved = async () => {
    setShowMetadataForm(false);
    setCapturedBlob(null);
    if (existingActivity?.id) {
      await loadDocuments(existingActivity.id);
    }
  };

  const handleMetadataCancel = () => {
    setShowMetadataForm(false);
    setCapturedBlob(null);
  };

  const handleCancelDocumentCapture = () => {
    setShowDocumentCapture(false);
  };

  const handleViewDocument = (documentId: number) => {
    setViewingDocumentId(documentId);
  };

  const handleCloseDocumentViewer = () => {
    setViewingDocumentId(null);
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteDocument(documentId);
      if (existingActivity?.id) {
        await loadDocuments(existingActivity.id);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleClose = () => {
    setType("work");
    setHours("");
    setDate("");
    setDates([]);
    setOrganization("");
    setWorkKind("");
    setEnrollmentStatus("");
    setEducationProgramType("");
    setEducationBasis("credit");
    setCreditHours("");
    setCommunityService({});
    setErrors({});
    setPendingDocument(null);
    setDocuments([]);
    documentUrls.forEach((url) => URL.revokeObjectURL(url));
    setDocumentUrls(new Map());
    setShowSuccess(false);
    setShowWarning(false);
    setWarningMessage("");
    onClose();
  };

  // Calculate total hours for multi-day entries
  const totalHours =
    dates.length > 1 && hours ? parseFloat(hours) * dates.length : null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="activity-form-title"
    >
      <DialogTitle id="activity-form-title">
        {existingActivity ? "Edit Activity" : "Log Hours"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          {/* Activity Type */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Activity Type *
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {(
                [
                  { value: "work", label: ACTIVITY_TYPE_LABELS.work },
                  {
                    value: "volunteer",
                    label: ACTIVITY_TYPE_LABELS.volunteer,
                  },
                  {
                    value: "education",
                    label: ACTIVITY_TYPE_LABELS.education,
                  },
                  // 42 CFR 435.552(a)(3). Could not be stored before W6a.
                  {
                    value: "workProgram",
                    label: ACTIVITY_TYPE_LABELS.workProgram,
                  },
                ] as const
              ).map((activityType) => (
                <Box
                  key={activityType.value}
                  sx={{
                    flex: "1 1 45%",
                    position: "relative",
                    border: "2px solid",
                    borderColor:
                      type === activityType.value ? "primary.main" : "divider",
                    borderRadius: 1,
                    bgcolor:
                      type === activityType.value
                        ? "primary.50"
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "primary.50",
                    },
                  }}
                  onClick={() =>
                    setType(activityType.value as Activity["type"])
                  }
                >
                  <Box
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: type === activityType.value ? 600 : 400,
                        color:
                          type === activityType.value
                            ? "primary.main"
                            : "text.primary",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      {activityType.label}
                    </Typography>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent selecting the type when clicking help
                      }}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <ActivityFormHelp
                        activityType={activityType.value}
                        inline={true}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            {errors.type && (
              <FormHelperText error>{errors.type}</FormHelperText>
            )}
          </Box>

          {/* Work sub-kind — 42 CFR 435.552(b). Paid, in-kind, or unpaid. */}
          {type === "work" && (
            <FormControl>
              <FormLabel
                id="work-kind-label"
                sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}
              >
                What kind of work? (optional)
              </FormLabel>
              <RadioGroup
                aria-labelledby="work-kind-label"
                value={workKind}
                onChange={(e) => setWorkKind(e.target.value as WorkKind)}
              >
                <FormControlLabel
                  value="paid"
                  control={<Radio size="small" />}
                  label="Paid — a job, gig work, or self-employment"
                />
                <FormControlLabel
                  value="in-kind"
                  control={<Radio size="small" />}
                  label="In-kind — paid in housing, meals, or utilities instead of money"
                />
                <FormControlLabel
                  value="unpaid"
                  control={<Radio size="small" />}
                  label="Unpaid — an unpaid internship, trial period, or caregiving hours"
                />
              </RadioGroup>
              <FormHelperText>
                All three count. This helps you know what to keep — in-kind and
                unpaid work often won&apos;t show up in records your state
                checks.
              </FormHelperText>
            </FormControl>
          )}

          {/* Education enrollment status — 42 CFR 435.552(c). The school decides. */}
          {type === "education" && (
            <FormControl error={!!errors.enrollmentStatus}>
              <FormLabel
                id="enrollment-status-label"
                sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}
              >
                How does your school say you&apos;re enrolled? *
              </FormLabel>
              <RadioGroup
                aria-labelledby="enrollment-status-label"
                value={enrollmentStatus}
                onChange={(e) =>
                  setEnrollmentStatus(
                    e.target.value as ActivityEnrollmentStatus,
                  )
                }
              >
                <FormControlLabel
                  value="at-least-half-time"
                  control={<Radio size="small" />}
                  label="At least half-time"
                />
                <FormControlLabel
                  value="less-than-half-time"
                  control={<Radio size="small" />}
                  label="Less than half-time"
                />
                <FormControlLabel
                  value="unknown"
                  control={<Radio size="small" />}
                  label="I'm not sure"
                />
              </RadioGroup>
              <FormHelperText error={!!errors.enrollmentStatus}>
                {errors.enrollmentStatus ||
                  "Your school decides this, not you and not your state. If you're not sure, pick \"I'm not sure\" and ask the registrar."}
              </FormHelperText>
            </FormControl>
          )}

          {/* At least half-time: counts on its own, no hours — 42 CFR 435.552(a)(4). */}
          {isHalfTimeStandalone && (
            <Alert severity="info" sx={{ "& a": { color: "inherit" } }}>
              At half-time or more, school may be enough on its own — there are
              no hours to add up, and it isn&apos;t combined with other
              activities. Your state decides what counts. Keep your enrollment
              confirmation from your school so you can show it.
            </Alert>
          )}

          {/* Less than half-time: choose credit vs non-credit basis — 42 CFR 435.552(d). */}
          {type === "education" &&
            enrollmentStatus === "less-than-half-time" && (
              <FormControl>
                <FormLabel
                  id="education-basis-label"
                  sx={{ fontSize: "0.875rem", fontWeight: 600, mb: 0.5 }}
                >
                  How does your program measure your work?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="education-basis-label"
                  value={educationBasis}
                  onChange={(e) =>
                    setEducationBasis(e.target.value as "credit" | "non-credit")
                  }
                >
                  <FormControlLabel
                    value="credit"
                    control={<Radio size="small" />}
                    label="In credit hours (most colleges)"
                  />
                  <FormControlLabel
                    value="non-credit"
                    control={<Radio size="small" />}
                    label="In class hours, not credits (e.g. a GED or non-credit program)"
                  />
                </RadioGroup>
              </FormControl>
            )}

          {/* Less than half-time, credit-based: credit hours convert — 42 CFR 435.552(d)(1). */}
          {isCreditBasedEducation && (
            <Box>
              <TextField
                label="Credit hours this month"
                type="number"
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value)}
                error={!!errors.creditHours}
                helperText={
                  errors.creditHours ||
                  "From your class schedule — keep it, it's what the figure is based on."
                }
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 1,
                    inputMode: "numeric",
                  },
                }}
              />
              {creditHours && parseFloat(creditHours) > 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {creditHours} credit hour
                  {parseFloat(creditHours) === 1 ? "" : "s"} ×{" "}
                  {
                    FEDERAL_DEFAULT.educationCreditHourConversion
                      .hoursPerCreditPerWeek
                  }{" "}
                  ×{" "}
                  {FEDERAL_DEFAULT.educationCreditHourConversion.weeksPerMonth}{" "}
                  ={" "}
                  <strong>
                    {educationContribution({
                      status: "less-than-half-time",
                      creditHours: parseFloat(creditHours),
                    }).combinableHours.toFixed(2)}{" "}
                    hours
                  </strong>{" "}
                  this month (42 CFR 435.552(d)). These can be combined with
                  work or community service. Keep your class schedule —
                  it&apos;s what this figure is based on.
                </Alert>
              )}
            </Box>
          )}

          {/* Program type — 42 CFR 435.552(b). Only for education. */}
          {type === "education" && enrollmentStatus && (
            <FormControl fullWidth size="small">
              <InputLabel id="program-type-label">
                Type of program (optional)
              </InputLabel>
              <Select
                labelId="program-type-label"
                label="Type of program (optional)"
                value={educationProgramType}
                onChange={(e) =>
                  setEducationProgramType(
                    e.target.value as EducationProgramType,
                  )
                }
              >
                <MenuItem value="higher-education">
                  College or university
                </MenuItem>
                <MenuItem value="career-technical">
                  Trade school / career & technical
                </MenuItem>
                <MenuItem value="high-school">High school</MenuItem>
                <MenuItem value="high-school-equivalency">
                  GED or high school equivalency
                </MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Hours — for non-education types, and for non-credit less-than-half-time
              education (§ 435.552(d)(2), counted 1:1). Hidden for half-time standalone,
              credit-based education, and before an education status is chosen. */}
          {(type !== "education" || isNonCreditEducation) && (
            <TextField
              label={
                isNonCreditEducation
                  ? "Class and activity hours this month"
                  : "Hours"
              }
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              error={!!errors.hours}
              helperText={
                errors.hours ||
                (isNonCreditEducation
                  ? "Count actual class and activity hours (§ 435.552(d)(2))."
                  : undefined)
              }
              required
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  max: 24,
                  step: 0.5,
                  inputMode: "decimal",
                },
              }}
            />
          )}

          {/* Date(s) */}
          {!existingActivity && (
            <Box>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (!dates.includes(e.target.value)) {
                    setDates([e.target.value]);
                  }
                }}
                error={!!errors.date}
                helperText={errors.date || "When did you complete these hours?"}
                required
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              {/* Add more dates section */}
              {dates.length > 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Selected dates:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                  >
                    {dates.map((d) => (
                      <Chip
                        key={d}
                        label={new Date(d + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                        size="small"
                        onDelete={() => {
                          const newDates = dates.filter((date) => date !== d);
                          setDates(newDates);
                          if (newDates.length > 0) {
                            setDate(newDates[0]);
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => additionalDateInputRef.current?.showPicker?.()}
              >
                <CalendarTodayIcon
                  sx={{ color: "primary.main", fontSize: 20 }}
                />
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 500 }}
                >
                  Add Another Date
                </Typography>
                <input
                  ref={additionalDateInputRef}
                  type="date"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                  }}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    if (newDate && !dates.includes(newDate)) {
                      setDates([...dates, newDate]);
                    }
                    // Clear the input
                    e.target.value = "";
                  }}
                />
              </Box>

              {/* Multi-day indicator */}
              {totalHours && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: "info.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "info.200",
                  }}
                >
                  <Typography variant="body2" color="info.main">
                    {dates.length} {dates.length === 1 ? "day" : "days"} ×{" "}
                    {hours} hours = <strong>{totalHours} total hours</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This will create {dates.length} separate{" "}
                    {dates.length === 1 ? "entry" : "entries"}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {existingActivity && (
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              required
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}

          {/* Source/Employer/Organization — the generic free-text field for everything
              except community service, which gets the structured record below. */}
          {type !== "volunteer" && (
            <TextField
              label="Source/Employer/Organization (Optional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              fullWidth
              placeholder="e.g., Acme Corp, Community College, SNAP E&T"
              helperText="Where did you complete these hours?"
            />
          )}

          {/* Community-service record — 42 CFR 435.552(b), § II.I.6.b (91 FR 33400).
              Progressive disclosure: name first, the verification detail that makes the
              record acceptable behind an expander, so the form does not deter logging. */}
          {type === "volunteer" && (
            <Box>
              <TextField
                label="Organization name (Optional)"
                value={communityService.organizationName ?? ""}
                onChange={(e) =>
                  setCommunityService((cs) => ({
                    ...cs,
                    organizationName: e.target.value,
                  }))
                }
                fullWidth
                placeholder="e.g., Food Bank, Parks Department, a local nonprofit"
                helperText="Doesn't have to be a registered charity. Your state can't limit it to 501(c)(3)s."
              />
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    size="small"
                    checked={communityService.courtOrdered ?? false}
                    onChange={(e) =>
                      setCommunityService((cs) => ({
                        ...cs,
                        courtOrdered: e.target.checked,
                      }))
                    }
                  />
                }
                label="This is court-ordered community service"
              />
              <Accordion
                disableGutters
                sx={{
                  mt: 1,
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Add verification details
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Why this matters: without a contact who can confirm your
                      hours, the record may not be accepted.
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      label="Organization address"
                      value={communityService.organizationAddress ?? ""}
                      onChange={(e) =>
                        setCommunityService((cs) => ({
                          ...cs,
                          organizationAddress: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="What did you do? (activity description)"
                      value={communityService.activityDescription ?? ""}
                      onChange={(e) =>
                        setCommunityService((cs) => ({
                          ...cs,
                          activityDescription: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                      placeholder="e.g., sorted donations, tutored students"
                    />
                    <TextField
                      label="Contact who can confirm your hours — name"
                      value={communityService.pointOfContactName ?? ""}
                      onChange={(e) =>
                        setCommunityService((cs) => ({
                          ...cs,
                          pointOfContactName: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Contact phone"
                      type="tel"
                      value={communityService.pointOfContactPhone ?? ""}
                      onChange={(e) =>
                        setCommunityService((cs) => ({
                          ...cs,
                          pointOfContactPhone: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                      slotProps={{ htmlInput: { inputMode: "tel" } }}
                    />
                    <TextField
                      label="Contact email"
                      type="email"
                      value={communityService.pointOfContactEmail ?? ""}
                      onChange={(e) =>
                        setCommunityService((cs) => ({
                          ...cs,
                          pointOfContactEmail: e.target.value,
                        }))
                      }
                      fullWidth
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      A phone number or an email is enough — you don&apos;t need
                      both.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {errors.submit && (
            <Typography color="error" variant="body2">
              {errors.submit}
            </Typography>
          )}

          {/* Document Section */}
          <Divider sx={{ my: 2 }} />
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="subtitle2">
                Documentation (Optional)
              </Typography>
              <DocumentVerificationHelpIcon activityType={type} />
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 2 }}
            >
              Add timesheets, pay stubs, or verification letters
            </Typography>

            {/* Pending document for new entries */}
            {!existingActivity && pendingDocument && (
              <Card sx={{ mb: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={URL.createObjectURL(pendingDocument.blob)}
                  alt="Pending document"
                />
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleRemovePendingDocument}
                    color="error"
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            )}

            {/* Existing documents */}
            {existingActivity && documents.length > 0 && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
              >
                {documents.map((doc) => {
                  const url = documentUrls.get(doc.id!);
                  return (
                    <Card key={doc.id} sx={{ display: "flex" }}>
                      {url && (
                        <CardMedia
                          component="img"
                          sx={{ width: 100, height: 100, objectFit: "cover" }}
                          image={url}
                          alt="Activity document"
                        />
                      )}
                      <CardActions sx={{ ml: "auto" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDocument(doc.id!)}
                          aria-label="view document"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteDocument(doc.id!)}
                          aria-label="delete document"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  );
                })}
              </Box>
            )}

            {/* Add document button */}
            <Button
              startIcon={
                <Badge
                  badgeContent={
                    existingActivity
                      ? documents.length
                      : pendingDocument
                        ? 1
                        : 0
                  }
                  color="primary"
                >
                  <AttachFileIcon />
                </Badge>
              }
              onClick={
                existingActivity
                  ? handleAddDocumentToExisting
                  : handleAddDocumentClick
              }
              variant="outlined"
              fullWidth
            >
              {existingActivity
                ? "Add Another Document"
                : pendingDocument
                  ? "Replace Document"
                  : "Add Document"}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        {existingActivity && onDelete && (
          <Button onClick={onDelete} color="error" sx={{ mr: "auto" }}>
            Delete
          </Button>
        )}
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>

      {/* Document Capture Dialog */}
      <Dialog
        open={showDocumentCapture}
        onClose={handleCancelDocumentCapture}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DocumentCapture
            onCapture={
              existingActivity
                ? handleDocumentCapturedForExisting
                : handleDocumentCaptured
            }
            onCancel={handleCancelDocumentCapture}
          />
        </DialogContent>
      </Dialog>

      {/* Document Metadata Form Dialog */}
      {showMetadataForm && capturedBlob && (
        <Dialog
          open={true}
          onClose={handleMetadataCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Document Details</DialogTitle>
          <DialogContent>
            <DocumentMetadataFormSimple
              blob={capturedBlob}
              onCancel={handleMetadataCancel}
              context="activity"
              onSave={
                existingActivity
                  ? async (metadata) => {
                      if (!existingActivity.id) return;
                      const { saveDocument } = await import(
                        "@/lib/storage/documents"
                      );
                      const { compressForStorage } = await import(
                        "@/lib/utils/imageCompression"
                      );

                      // Compresses above 5MB and REFUSES anything still over
                      // 10MB — rescued from the dead DocumentMetadataForm by
                      // W0 § 0.4.
                      const { blob: finalBlob, compressedSize } =
                        await compressForStorage(capturedBlob);

                      await saveDocument(existingActivity.id, finalBlob, {
                        type: metadata.type as Document["type"],
                        customType: metadata.customType,
                        description: metadata.description,
                        fileSize: capturedBlob.size,
                        compressedSize,
                        mimeType: capturedBlob.type as
                          | "image/jpeg"
                          | "image/png",
                        captureMethod: "camera",
                      });

                      await handleMetadataSaved();
                    }
                  : handleMetadataSavedForNew
              }
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Document Viewer Dialog */}
      {viewingDocumentId !== null && (
        <DocumentViewer
          documentId={viewingDocumentId}
          // Ids here come from getDocumentsByActivity, i.e. db.documents.
          context="activity"
          onClose={handleCloseDocumentViewer}
          onDelete={async (deletedId) => {
            setDocuments((prev) => prev.filter((doc) => doc.id !== deletedId));
            handleCloseDocumentViewer();
          }}
        />
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Activity saved successfully!
        </Alert>
      </Snackbar>

      {/* Warning Snackbar */}
      <Snackbar
        open={showWarning}
        autoHideDuration={6000}
        onClose={() => setShowWarning(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowWarning(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {warningMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
