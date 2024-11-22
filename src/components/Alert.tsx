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
import { AlertOrConfirmWrapper, AlertProps, ConfirmProps, offAlert, onAlert } from "@/hooks/alert";

export default function Alert() {
  const [wrapper, setWrapper] = useState<AlertOrConfirmWrapper | undefined>(undefined);

  // Listen for alert events
  useEffect(() => {
    const handleAlert = (wrapper: AlertOrConfirmWrapper) => {
      (document.activeElement as HTMLElement | null)?.blur();
      setWrapper(wrapper);
    };

    onAlert(handleAlert);

    // Clean up the listener when the component unmounts
    return () => {
      offAlert(handleAlert);
    };
  }, []);

  // Close the alert dialog
  const closeAlert = () => setWrapper(undefined);

  if (!wrapper) return null; // Render nothing if no alert is active

  return (
    <AlertDialog open={!!wrapper} onOpenChange={closeAlert}>
      {wrapper.type === "alert"
        ? <AlertDialogContentWrapper alert={wrapper.props} />
        : <ConfirmDialogContentWrapper confirm={wrapper.props}/>}
    </AlertDialog>
  );
}

function AlertDialogContentWrapper({ alert }:{
  alert: AlertProps;
}) {
  const tGeneral = useTranslations("general");
  return <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{alert.title}</AlertDialogTitle>
      <AlertDialogDescription>{alert.message}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>
        {tGeneral("dismiss")}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>;
}

function ConfirmDialogContentWrapper({ confirm }:{
  confirm: ConfirmProps;
}) {
  const tGeneral = useTranslations("general");
  return <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{confirm.title}</AlertDialogTitle>
      <AlertDialogDescription>{confirm.message}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>
        {tGeneral("cancel")}
      </AlertDialogCancel>
      <AlertDialogAction onClick={confirm.onConfirm}>
        {confirm.confirmText}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>;
}
