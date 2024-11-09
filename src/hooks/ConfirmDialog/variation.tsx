import React from "react";
import { useConfirmDialog } from "./hook";
import { DialogTitle, DialogContent } from "@/shadcn/ui/dialog";
import { Gap } from "@/shadcn/ui/layouts";

export interface AlertDialogT {
  title?: string;
  body: string;
  useOk?: boolean;
  useCancel?: boolean;
  dismissible?: boolean;
}

// eslint-disable-next-line
export function useAlertDialog() {
  const { showConfirmDialog } = useConfirmDialog();

  function showAlertDialog(option: AlertDialogT): Promise<null | boolean> {
    const { title, body, useOk, useCancel, dismissible } = option;
    const main = (
      <>
        {Boolean(title) && <DialogTitle className="text-white text-[20pt]">{title}</DialogTitle>}
        <Gap y={1} />
        <span className="text-white">{body}</span>
      </>
    );
    return showConfirmDialog({
      main,
      useOk,
      useCancel,
      dismissible,
    });
  }

  return {
    showAlertDialog,
  };
}


export function useLoginAlertDialog() {
  const { showAlertDialog } = useAlertDialog();

  function showLoginAlertDialog(): Promise<boolean|null> {
    return showAlertDialog({
      body: "로그인 이후 이용하실 수 있습니다.",
      useOk: true,
      dismissible: true,
    });
  }

  return {
    showLoginAlertDialog,
  };
}