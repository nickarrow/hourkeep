"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted state to avoid hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize online status
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || isOnline) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "warning.main",
        color: "warning.contrastText",
        padding: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        zIndex: 9999,
        // W8a (semantic review #12): never print the device banner on a faxed evidence
        // package — it would land on top of the record and tell the caseworker about the
        // user's connection, not their evidence.
        "@media print": { display: "none" },
      }}
    >
      <WifiOffIcon fontSize="small" />
      <Typography variant="body2">
        You&apos;re offline. Changes will be saved locally.
      </Typography>
    </Box>
  );
}
