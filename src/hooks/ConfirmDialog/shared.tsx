"use client";
import React, { Fragment } from "react";
// import { Button, Dialog, DialogActions } from '@mui/material';
import { Dialog, DialogContent, DialogFooter } from "@/ui/shadcn/Dialog";
import { Button } from "@/ui/shadcn/Button";
import { useLogic } from "./logic";
import { useTranslations } from "next-intl";

export function ConfirmDialogShared(): JSX.Element {
  const {
    isOpen,
    main,
    useOk,
    useCancel,
    handleOkClick,
    handleCancelClick,
    handleDismissClick,
  } = useLogic();

  const t = useTranslations("shared");

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open == false) {
          handleDismissClick();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-auto scrollbar-hide">
        {main}

        <DialogFooter>
          {useCancel && (
            <Button
              variant='ghost'
              onClick={handleCancelClick}
              className="bg-red text-white">
              {t("close")}
            </Button>
          )}

          {useOk && (
            <Button
              variant='default'
              onClick={handleOkClick}
              className="bg-mint text-white">
              {t("confirm")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
