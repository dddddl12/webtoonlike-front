"use client";
import React from "react";
import { useUserActions } from "@/states/UserState";
import { useSnackbar } from "@/hooks/Snackbar";
import { CreatorProfileForm } from "@/components/CreatorProfileForm";
import * as CreatorApi from "@/apis/creators";
import type { CreatorFormT } from "@/types";

export function CreatorSetupEditor(): JSX.Element {
  const userAct = useUserActions(); // TODO

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: CreatorFormT): Promise<void> {
    try {
      const creator = await CreatorApi.create(form);
      // userAct.patchData({ me: { ...me, creator } });
      enqueueSnackbar("creator successfully updated", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("profile error..", { variant: "error" });
    }
  }

  return (
    <div>
      <CreatorProfileForm
        onSubmit={handleSubmit}
      />
    </div>
  );
}