"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { Activity } from "@/types";
import { format, parseISO, addDays, startOfWeek } from "date-fns";
import {
  ACTIVITY_TYPE_LABELS,
  activityOrganizationLabel,
} from "@/lib/activityDisplay";

interface DuplicateActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onDuplicate: (dates: string[]) => void;
  activity: Activity | null;
}

export function DuplicateActivityDialog({
  open,
  onClose,
  onDuplicate,
  activity,
}: DuplicateActivityDialogProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  if (!activity) return null;

  const activityDate = parseISO(activity.date);
  const weekStart = startOfWeek(activityDate, { weekStartsOn: 0 }); // Sunday

  // Generate dates for the current week
  const weekDates: Date[] = [];
  for (let i = 0; i <= 6; i++) {
    weekDates.push(addDays(weekStart, i));
  }

  const handleToggleDate = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr],
    );
  };

  const handleDuplicate = () => {
    if (selectedDates.length > 0) {
      onDuplicate(selectedDates);
      setSelectedDates([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedDates([]);
    onClose();
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Duplicate Activity</DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Original Activity:
          </Typography>
          <Typography variant="body1">
            {format(activityDate, "MMM d, yyyy")} • {activity.hours}{" "}
            {activity.hours === 1 ? "hour" : "hours"} •{" "}
            {ACTIVITY_TYPE_LABELS[activity.type]}
          </Typography>
          {activityOrganizationLabel(activity) && (
            <Typography variant="body2" color="text.secondary">
              {activityOrganizationLabel(activity)}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" gutterBottom sx={{ mt: 3 }}>
          Select dates to copy this activity to:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          {weekDates.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const isOriginal = dateStr === activity.date;
            const isSelected = selectedDates.includes(dateStr);
            const dayIndex = date.getDay();

            return (
              <Button
                key={dateStr}
                variant={isSelected ? "contained" : "outlined"}
                onClick={() => !isOriginal && handleToggleDate(dateStr)}
                disabled={isOriginal}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  py: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: 50,
                      fontWeight: "bold",
                      mr: 2,
                    }}
                  >
                    {dayNames[dayIndex]}
                  </Typography>
                  <Typography>{format(date, "MMM d, yyyy")}</Typography>
                  {isOriginal && (
                    <Typography
                      variant="caption"
                      sx={{ ml: "auto", fontStyle: "italic" }}
                    >
                      (original)
                    </Typography>
                  )}
                </Box>
              </Button>
            );
          })}
        </Box>

        {selectedDates.length > 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            This will create {selectedDates.length} new{" "}
            {selectedDates.length === 1 ? "activity" : "activities"}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleDuplicate}
          variant="contained"
          disabled={selectedDates.length === 0}
        >
          Duplicate to {selectedDates.length}{" "}
          {selectedDates.length === 1 ? "date" : "dates"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
