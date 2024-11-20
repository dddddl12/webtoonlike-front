import { BasicGenreT, deleteGenre } from "@/resources/genres/genre.service";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { useConfirm } from "@/hooks/alert";
import { IconDelete } from "@/components/svgs/IconDelete";
import useSafeAction from "@/hooks/safeAction";

export default function useDeleteGenre({ reloadOnUpdate, genre }: {
  reloadOnUpdate: () => void;
  genre: BasicGenreT;
}) {
  const { toast } = useToast();
  const { execute } = useSafeAction(deleteGenre.bind(null, genre.id), {
    onSuccess: () => {
      toast({
        description: "장르가 삭제되었습니다."
      });
      reloadOnUpdate();
    }
  });
  const confirm = useConfirm({
    title: "장르 삭제",
    message: `장르 ${genre.label}를 삭제하시겠습니까?`,
    confirmText: "삭제",
    onConfirm: execute
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
