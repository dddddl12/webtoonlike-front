"use client";
import { Button } from "@/shadcn/ui/button";
import { useTranslations } from "next-intl";
import { useConfirm } from "@/hooks/alert";
import { deleteUser } from "@/resources/users/controllers/user.controller";
import { ClerkLoaded, useAuth } from "@clerk/nextjs";
import { useToast } from "@/shadcn/hooks/use-toast";
import { useRouter } from "@/i18n/routing";

export default function AccountBasicInfoSectionDeleteButton() {
  const TeditProfile = useTranslations("accountPage");
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const confirm = useConfirm({
    title: TeditProfile("withdrawalTitle"),
    message: TeditProfile("withdrawalDesc"),
    confirmText: TeditProfile("withdrawalConfirm"),
    onConfirm: async () => {
      await deleteUser();
      //todo 실패 핸들링
      toast({
        description: TeditProfile("withdrawalToast"),
      });
      await auth?.signOut();
      router.replace("/", {
        scroll: true
      });
    }
  });

  return <ClerkLoaded>
    <Button
      variant="destructive"
      onClick={confirm.open}
    >
      {TeditProfile("withdrawal")}
    </Button>
  </ClerkLoaded>;
}