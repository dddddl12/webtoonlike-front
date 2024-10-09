"use client";

import React, { useContext } from "react";
import { useRouter } from "@/i18n/routing";
import { BuyerProfileForm } from "@/components/BuyerProfileForm";
import * as BuyerApi from "@/apis/buyers";
import { useSnackbar } from "@/hooks/Snackbar";
import type { BuyerFormT } from "@/types";
import { MeContext } from "@/components/$providers/MeProvider";

export function BuyerUpdateProfileForm(): JSX.Element {
  const router = useRouter();
  const { me, setMe } = useContext(MeContext);
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: BuyerFormT) {
    try {
      const buyerUpdated = await BuyerApi.create(form);
      setMe(me => {
        // me.user!.buyer = buyerUpdated;
        return me;
      });
      enqueueSnackbar("buyer successfully updated!", { variant: "success" });
      router.push("/buyer/my");
    } catch (e) {
      // TODO 예외 처리 통일
      enqueueSnackbar("buyer update error", { variant: "error" });
    }
  }

  return (
    <BuyerProfileForm
      buyer={me.user?.buyer ?? undefined}
      onSubmit={handleSubmit}
    />
  );

}
