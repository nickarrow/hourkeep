"use client";

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Work as WorkIcon,
  WorkOutline as WorkOutlineIcon,
  VolunteerActivism as VolunteerIcon,
  School as SchoolIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import React from "react";
import { Activity } from "@/types";
import { ACTIVITY_TYPE_LABELS } from "@/lib/activityDisplay";

interface DateActivityMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  activities: Activity[];
  onAddNew: () => void;
  onEditActivity: (activity: Activity) => void;
  onDuplicateActivity: (activity: Activity) => void;
  selectedDateStr: string;
}

const activityIcons: Record<Activity["type"], React.ReactElement> = {
  work: <WorkIcon fontSize="small" />,
  volunteer: <VolunteerIcon fontSize="small" />,
  education: <SchoolIcon fontSize="small" />,
  // 42 CFR 435.552(a)(3). WorkOutline distinguishes a job-training program from paid work.
  workProgram: <WorkOutlineIcon fontSize="small" />,
};

const activityColors = {
  work: "primary",
  volunteer: "success",
  education: "info",
  workProgram: "secondary",
} as const;

export function DateActivityMenu({
  anchorEl,
  open,
  onClose,
  activities,
  onAddNew,
  onEditActivity,
  onDuplicateActivity,
  selectedDateStr,
}: DateActivityMenuProps) {
  const handleAddNew = () => {
    onAddNew();
    onClose();
  };

  const handleEdit = (activity: Activity) => {
    onEditActivity(activity);
    onClose();
  };

  const handleDuplicate = (activity: Activity) => {
    onDuplicateActivity(activity);
    onClose();
  };

  const menuItems = [
    <Box key="header" sx={{ px: 2, py: 1 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {selectedDateStr}
      </Typography>
    </Box>,
    <MenuItem key="add-new" onClick={handleAddNew}>
      <ListItemIcon>
        <AddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Add New Activity</ListItemText>
    </MenuItem>,
  ];

  if (activities.length > 0) {
    menuItems.push(
      <Divider key="divider" sx={{ my: 1 }} />,
      <Box key="activities-header" sx={{ px: 2, pt: 1, pb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Existing Activities:
        </Typography>
      </Box>,
      <Box key="activities-list" sx={{ px: 2, pb: 1 }}>
        {activities.map((activity, index) => (
          <Box
            key={activity.id}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              mb: index < activities.length - 1 ? 1.5 : 0,
              overflow: "hidden",
              backgroundColor: "background.paper",
            }}
          >
            {/* Activity Info */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: "grey.50",
              }}
            >
              <Box sx={{ color: "action.active" }}>
                {activityIcons[activity.type]}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Chip
                    label={ACTIVITY_TYPE_LABELS[activity.type]}
                    color={activityColors[activity.type]}
                    size="small"
                  />
                  <Typography variant="body2" fontWeight="medium">
                    {activity.hours}h
                  </Typography>
                </Box>
                {activity.organization && (
                  <Typography variant="caption" color="text.secondary">
                    {activity.organization}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", borderTop: 1, borderColor: "divider" }}>
              <MenuItem
                onClick={() => handleEdit(activity)}
                sx={{
                  flex: 1,
                  justifyContent: "center",
                  py: 1,
                  borderRight: 1,
                  borderColor: "divider",
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </MenuItem>
              <MenuItem
                onClick={() => handleDuplicate(activity)}
                sx={{ flex: 1, justifyContent: "center", py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Duplicate" />
              </MenuItem>
            </Box>
          </Box>
        ))}
      </Box>,
    );
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {menuItems}
    </Menu>
  );
}
