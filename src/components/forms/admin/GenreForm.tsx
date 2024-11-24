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
import { createOrUpdateGenre } from "@/resources/genres/genre.controller";
import { GenreFormSchema, GenreFormT, GenreT } from "@/resources/genres/genre.dto";
import { UseFormReturn } from "react-hook-form";
import Spinner from "@/components/ui/Spinner";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";

export default function GenreForm({ reload, children, prev }: {
  reload: () => void;
  children: ReactNode;
  prev?: GenreT;
}) {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      createOrUpdateGenre.bind(null, prev?.id),
      zodResolver(GenreFormSchema),
      {
        actionProps: {
          onSuccess: () => {
            toast({
              description: prev ? "장르가 수정되었습니다." : "장르가 추가되었습니다."
            });
            setEditorOpen(false);
            reload();
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
        <GenreFormContent form={form} />
        <DialogFooter className='justify-end'>
          <DialogClose asChild>
            <Button variant='ghost'>
              취소
            </Button>
          </DialogClose>
          <Button
            disabled={!isValid || isSubmitting || isSubmitSuccessful}
            onClick={handleSubmitWithAction}
          >
            {prev ? "수정" : "추가"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

function GenreFormContent({
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