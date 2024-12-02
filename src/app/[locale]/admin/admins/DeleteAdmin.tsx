import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { deleteAdmin } from "@/resources/admins/admin.controller";
import { useConfirm } from "@/hooks/alert";
import { IconDelete } from "@/components/svgs/IconDelete";
import useSafeAction from "@/hooks/safeAction";

export default function DeleteAdmin({ reload, adminId }: {
  reload: () => void;
  adminId: number;
}) {
  const { toast } = useToast();
  const { execute } = useSafeAction(deleteAdmin.bind(null, adminId), {
    onSuccess: () => {
      toast({
        description: "관리자 권한이 삭제되었습니다."
      });
      reload();
    }
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
