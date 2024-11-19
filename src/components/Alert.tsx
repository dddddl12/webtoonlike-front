"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { offAlert, onAlert } from "@/hooks/alert";

export default function Alert() {
  const tGeneral = useTranslations("general");
  const [alert, setAlert] = useState<null | {
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>(null);

  // Listen for alert events
  useEffect(() => {
    const handleAlert = (alertData: typeof alert) => {
      setAlert(alertData);
    };

    onAlert(handleAlert);

    // Clean up the listener when the component unmounts
    return () => {
      offAlert(handleAlert);
    };
  }, []);

  // Close the alert dialog
  const closeAlert = () => setAlert(null);

  if (!alert) return null; // Render nothing if no alert is active

  return (
    <AlertDialog open={!!alert} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert.title}</AlertDialogTitle>
          <AlertDialogDescription>{alert.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => { alert.onCancel(); closeAlert(); }}>
            {tGeneral("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => { alert.onConfirm(); closeAlert(); }}>
            {alert.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
