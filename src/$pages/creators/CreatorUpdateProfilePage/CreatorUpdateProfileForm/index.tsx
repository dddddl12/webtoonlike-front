"use client";
import React from "react";
import { useRouter } from "@/i18n/routing";
import { CreatorProfileForm } from "@/components/CreatorProfileForm";
import { useMe, useUserActions } from "@/states/UserState";
import * as CreatorApi from "@/apis/creators";
import { useSnackbar } from "@/hooks/Snackbar";
import type { CreatorFormT } from "@/types";

export function CreatorUpdateProfileForm(): JSX.Element {
  const router = useRouter();
  const me = useMe();
  const userAct = useUserActions();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: CreatorFormT) {
    if (!me) {
      return;
    }
    try {
      const created = await CreatorApi.create(form);
      userAct.patchData({ me: { ...me, creator: created } });
      enqueueSnackbar("creator successfully updated!", { variant: "success" });
      router.push("/creator/my");
    } catch (e) {
      enqueueSnackbar("creator update error", { variant: "error" });
    }
  }

  return (
    <CreatorProfileForm
      creator={me?.creator ?? undefined}
      onSubmit={handleSubmit}
    />
  );

}
