"use client";

import { Alert, AlertTitle, Box, Button, Typography } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";

/**
 * The warning shown before an evidence package is produced — W8a, ADR-0006.
 *
 * The package deliberately contains the user's name, date of birth, and Medicaid ID,
 * because the agency needs them to match the record to a case. That is correct, and also a
 * reason to tell the user before the file lands in their downloads folder or a print
 * dialog. ADR-0006 § Non-negotiables: "A PII warning before download."
 *
 * NO VERDICT (ADR-0003). This component states a fact about the file's contents and names
 * the next action; it asserts nothing about the user's status. It is in
 * `no-verdict.render.test.tsx` from the commit that created it, per the W2b/W5 lesson that a
 * new user-facing component left out of the guard is how verdicts ship.
 */
interface PiiWarningProps {
  /** Proceed to produce the package. */
  onConfirm: () => void;
  /** Back out without producing it. */
  onCancel: () => void;
}

export function PiiWarning({ onConfirm, onCancel }: PiiWarningProps) {
  return (
    <Box>
      <Alert severity="warning" icon={<LockIcon />} sx={{ mb: 2 }}>
        <AlertTitle>This package includes personal information</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          To let your state match this record to your case, the package includes
          your name, date of birth, and Medicaid ID, along with any photos of
          documents you added. Your agency needs these details.
        </Typography>
        <Typography variant="body2">
          Keep the file somewhere private, and only share it with your state
          through a channel they accept.
        </Typography>
      </Alert>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={onConfirm}>
          I understand — continue
        </Button>
        <Button variant="text" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
