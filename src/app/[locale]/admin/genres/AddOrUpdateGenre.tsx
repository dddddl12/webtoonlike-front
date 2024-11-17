import { ReactNode, useEffect, useState } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { BasicGenreT, createOrUpdateGenre } from "@/resources/genres/genre.service";
import { GenreFormSchema, GenreFormT } from "@/resources/genres/genre.types";
import { UseFormReturn } from "react-hook-form";
import Spinner from "@/components/Spinner";
import { useTranslations } from "next-intl";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { formResolver } from "@/utils/forms";
import { clientErrorHandler } from "@/handlers/clientErrorHandler";

export default function AddOrUpdateGenre({ onGenreAddSuccess, children, prev }: {
  onGenreAddSuccess: () => void;
  children: ReactNode;
  prev?: BasicGenreT;
}) {
  // TODO
  const tError = useTranslations("errors");
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const { form, handleSubmitWithAction }
    = useHookFormAction(
      createOrUpdateGenre.bind(null, prev?.id),
      (values) => formResolver(GenreFormSchema, values),
      {
        actionProps: {
          onSuccess: () => {
            toast({
              description: prev ? "장르가 수정되었습니다." : "장르가 추가되었습니다."
            });
            setEditorOpen(false);
            onGenreAddSuccess();
          },
          onError: (args) => {
            form.reset(args.input);
            clientErrorHandler(args);
          }
        },
        formProps: {
          mode: "onChange"
        },
        errorMapProps: {}
      });
  const { formState: { isValid, isSubmitting, isSubmitSuccessful } } = form;

  useEffect(() => {
    if (editorOpen) {
      form.reset({
        label: prev?.label ?? "" ,
        label_en: prev?.label_en ?? ""
      });
    }
  }, [prev, editorOpen, form]);

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
            disabled={!isValid || isSubmitting || isSubmitSuccessful}
            onClick={async (e) => {
              await handleSubmitWithAction(e);
            }}
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
            <FormMessage/>
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
            <FormMessage/>
          </FormItem>
        )}
      />
    </form>
  </Form>;
}