import { deleteGenre } from "@/resources/genres/genre.controller";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { useConfirm } from "@/hooks/alert";
import { IconDelete } from "@/components/svgs/IconDelete";
import useSafeAction from "@/hooks/safeAction";
import { GenreT } from "@/resources/genres/genre.dto";

export default function useDeleteGenre({ reload, genre }: {
  reload: () => void;
  genre: GenreT;
}) {
  const { toast } = useToast();
  const { execute } = useSafeAction(deleteGenre.bind(null, genre.id), {
    onSuccess: () => {
      toast({
        description: "장르가 삭제되었습니다."
      });
      reload();
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
