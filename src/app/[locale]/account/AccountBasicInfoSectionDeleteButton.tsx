"use client";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";

export default function AccountBasicInfoSectionDeleteButton() {

  const TeditProfile = useTranslations("accountPage");

  async function handleClickDeleteMe(): Promise<void> {
  // TODO
  // const isOk = await showAlertDialog({
  //   title: TeditProfile("withdrawal"),
  //   body: TeditProfile("withdrawalDesc"),
  //   useOk: true,
  // });
  // if (!isOk) {
  //   return;
  // }
  // try {
  //   await UserApi.deleteMe();
  //   window.location.href = "/";
  // } catch (e) {
  //   console.error(e);
  // }
  }
  return <Button
    variant="red"
    onClick={handleClickDeleteMe}
  >
    {TeditProfile("withdrawal")}
  </Button>;
}