import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteAdmin } from "@/resources/admins/admin.service";
import { clientErrorHandler } from "@/handlers/clientErrorHandler";
import { useConfirm } from "@/hooks/alert";
import { IconDelete } from "@/components/svgs/IconDelete";

export default function DeleteAdmin({ reloadOnUpdate, adminId }: {
  reloadOnUpdate: () => void;
  adminId: number;
}) {
  const { toast } = useToast();
  const { execute } = useAction(deleteAdmin.bind(null,adminId), {
    onSuccess: () => {
      toast({
        description: "관리자 권한이 삭제되었습니다."
      });
      reloadOnUpdate();
    },
    onError: clientErrorHandler
  });
  const confirm = useConfirm({
    title: "관리자 권한 삭제",
    message: "해당 관리자 권한을 삭제하시겠습니까?",
    confirmText: "삭제",
    onConfirm: execute
  });

  return <Button
    onClick={confirm.open}
    variant="red"
    size="smallIcon">
    <IconDelete/>
  </Button>;
}
