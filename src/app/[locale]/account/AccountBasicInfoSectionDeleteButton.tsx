"use client";
import { Button } from "@/components/ui/shadcn/Button";
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
    className="bg-red rounded-sm hover:bg-gray-darker"
    onClick={handleClickDeleteMe}
  >
    {TeditProfile("withdrawal")}
  </Button>;
}