"use client";
import React from "react";
import { useMe, useUserActions } from "@/states/UserState";
import { useSnackbar } from "@/hooks/Snackbar";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import * as BuyerApi from "@/apis/buyers";
import type { BuyerFormT } from "@/types";

export function BuyerSetupEditor(): JSX.Element {
  const me = useMe();
  const userAct = useUserActions();

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: BuyerFormT) {
    if (!me) {
      return;
    }
    try {
      const buyer = await BuyerApi.create(form);
      userAct.patchData({ me: { ...me, buyer } });
      enqueueSnackbar("buyer successfully updated", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("profile error..", { variant: "error" });
    }
  }

  return (
    <div>
      <BuyerProfileForm
        onSubmit={handleSubmit}
      />
    </div>
  );
}