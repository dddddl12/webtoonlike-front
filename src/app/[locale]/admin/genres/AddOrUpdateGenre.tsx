import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { useToast } from "@/shadcn/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { BasicGenreT, createGenre, updateGenre } from "@/resources/genres/genre.service";
import { GenreFormSchema, GenreFormT } from "@/resources/genres/genre.types";
import { useForm, UseFormReturn } from "react-hook-form";
import { formResolver } from "@/utils/forms";
import Spinner from "@/components/Spinner";

export default function AddOrUpdateGenre({ onGenreAddSuccess, children, prev }: {
  onGenreAddSuccess: () => void;
  children: ReactNode;
  prev?: BasicGenreT;
}) {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const onSubmit = async (values: GenreFormT) => {
    if (prev) {
      await updateGenre(prev.id, values);
      toast({
        description: "장르가 추가되었습니다."
      });
    } else {
      await createGenre(values);
      toast({
        description: "장르가 수정되었습니다."
      });
    }
    setEditorOpen(false);
    onGenreAddSuccess();
  };

  const form = useForm<GenreFormT>({
    defaultValues: {
      label: prev?.label ?? "" ,
      label_en: prev?.label_en ?? ""
    },
    mode: "onChange",
    resolver: async (values) => formResolver(GenreFormSchema, values)
  });
  const { formState: { isValid } } = form;

  // TODO 순서(rank 사용)

  return (
    <Dialog
      open={editorOpen}
      onOpenChange={setEditorOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle>
            {prev ? "장르 수정하기" : "장르 추가하기"}
          </DialogTitle>
          <DialogDescription>
            장르 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <GenreForm form={form} />
        <DialogFooter className='justify-end'>
          <DialogClose asChild>
            <Button variant='ghost'>
              취소
            </Button>
          </DialogClose>
          <Button
            disabled={!isValid}
            onClick={form.handleSubmit(onSubmit)}
          >
            {prev ? "수정" : "추가"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

function GenreForm({
  form,
}: {
  form: UseFormReturn<GenreFormT>;
}) {
  const { formState: { isSubmitting, isSubmitSuccessful } } = form;
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner />;
  }
  return <Form {...form}>
    <form className="space-y-4">
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>한글</FormLabel>
            <FormControl>
              <Input
                {...field}
                type='text'
                placeholder='ex) 로맨스, 액션, 스릴러 등...'
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="label_en"
        render={({ field }) => (
          <FormItem>
            <FormLabel>영어</FormLabel>
            <FormControl>
              <Input
                {...field}
                type='text'
                placeholder='ex) romance, action, thriller ...'
              />
            </FormControl>
          </FormItem>
        )}
      />
    </form>
  </Form>;
}