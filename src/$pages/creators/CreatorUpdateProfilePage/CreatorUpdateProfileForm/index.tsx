"use client";
import React, { useContext } from "react";
import { useRouter } from "@/i18n/routing";
import { CreatorProfileForm } from "@/components/CreatorProfileForm";
import * as CreatorApi from "@/apis/creators";
import { useSnackbar } from "@/hooks/Snackbar";
import { MeContext } from "@/components/$providers/MeProvider";
import type { CreatorFormT } from "@backend/types/Creator";

export function CreatorUpdateProfileForm(): JSX.Element {
  const router = useRouter();
  const { me, setMe } = useContext(MeContext);
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: CreatorFormT) {
    if (!me) {
      return;
    }
    try {
      const creatorUpdated = await CreatorApi.create(form);
      setMe(me => {
        me.user!.creator = creatorUpdated;
        return me;
      });
      enqueueSnackbar("creator successfully updated!", { variant: "success" });
      router.push("/creator/my");
    } catch (e) {
      enqueueSnackbar("creator update error", { variant: "error" });
    }
  }

  return (
    <CreatorProfileForm
      creator={me?.user?.creator ?? undefined}
      onSubmit={handleSubmit}
    />
  );

}
