import { BasicGenreT, deleteGenre } from "@/resources/genres/genre.service";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { ForeignKeyError } from "@/handlers/errors";
import { clientErrorHandler } from "@/handlers/clientErrorHandler";
import { useAlert, useConfirm } from "@/hooks/alert";
import { IconDelete } from "@/components/svgs/IconDelete";

export default function useDeleteGenre({ reloadOnUpdate, genre }: {
  reloadOnUpdate: () => void;
  genre: BasicGenreT;
}) {
  const { toast } = useToast();
  const { execute } = useAction(deleteGenre.bind(null, genre.id), {
    onSuccess: () => {
      toast({
        description: "장르가 삭제되었습니다."
      });
      reloadOnUpdate();
    },
    onError: (args) => {
      const { serverError } = args.error;
      if (serverError?.name === ForeignKeyError.name) {
        failureAlert.open();
      }
      clientErrorHandler(args);
    }
  });
  const confirm = useConfirm({
    title: "장르 삭제",
    message: `장르 ${genre.label}를 삭제하시겠습니까?`,
    confirmText: "삭제",
    onConfirm: execute
  });
  const failureAlert = useAlert({
    title: "장르 삭제 실패",
    message: `${genre.label} 장르를 사용 중인 웹툰이 존재합니다.`
  });

  return <Button
    variant="red"
    size="smallIcon"
    onClick={confirm.open}
  >
    <IconDelete/>
  </Button>
  ;
}
