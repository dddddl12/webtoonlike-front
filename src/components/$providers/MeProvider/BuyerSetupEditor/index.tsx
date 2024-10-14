import React from "react";
import { useSnackbar } from "@/hooks/Snackbar";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import * as BuyerApi from "@/apis/buyers";
import type { BuyerFormT } from "@backend/types/Buyer";

export function BuyerSetupEditor(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: BuyerFormT) {
    try {
      await BuyerApi.create(form);
      enqueueSnackbar("buyer successfully updated", { variant: "success" });
    } catch (e) {
      console.error(e);
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