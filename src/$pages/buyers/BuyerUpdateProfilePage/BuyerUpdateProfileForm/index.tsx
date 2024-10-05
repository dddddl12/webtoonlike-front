"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import { useMe, useUserActions } from "@/states/UserState";
import * as BuyerApi from "@/apis/buyers";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BuyerFormT } from "@/types";

export function BuyerUpdateProfileForm(): JSX.Element {
  const router = useRouter();
  const me = useMe();
  const userAct = useUserActions();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: BuyerFormT) {
    if (!me) {
      return;
    }
    try {
      const created = await BuyerApi.create(form);
      userAct.patchData({ me: { ...me, buyer: created } });
      enqueueSnackbar("buyer successfully updated!", { variant: "success" });
      router.push("/buyer/my");
    } catch (e) {
      enqueueSnackbar("buyer update error", { variant: "error" });
    }
  }

  return (
    <BuyerProfileForm
      buyer={me?.buyer ?? undefined}
      onSubmit={handleSubmit}
    />
  );

}
