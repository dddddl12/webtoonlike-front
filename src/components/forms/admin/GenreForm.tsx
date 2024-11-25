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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { createOrUpdateGenre, getGenre } from "@/resources/genres/genre.controller";
import { GenreFormSchema, GenreT } from "@/resources/genres/genre.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { clsx } from "clsx";
import useSafeActionForm from "@/hooks/safeActionForm";

export default function GenreForm({ reload, children, prev }: {
  reload: () => void;
  children: ReactNode;
  prev?: GenreT;
}) {
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={editorOpen}
      onOpenChange={setEditorOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogContentWrapper
          prev={prev}
          reload={() => {
            setEditorOpen(false);
            reload();
          }} />
      </DialogContent>
    </Dialog>
  );
}

function DialogContentWrapper({ reload, prev }: {
  reload: () => void;
  prev?: GenreT;
}) {
  const { toast } = useToast();
  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    createOrUpdateGenre.bind(null, prev?.id), {
      resolver: zodResolver(GenreFormSchema),
      defaultValues: prev
        ? async () => getGenre(prev.id)
          .then(res => {
            if (!res?.data) {
              throw new Error("No data");
            }
            return {
              label: res.data.label,
              label_en: res.data.label_en,
              rank: res.data.rank,
            };
          })
        : undefined,
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: prev ? "장르가 수정되었습니다." : "장르가 추가되었습니다."
          });
          reload();
        }
      }
    });
  const { formState: { isLoading, isValid, isDirty } } = form;

  return <>
    <DialogHeader className="gap-2">
      <DialogTitle>
        {prev ? "장르 수정하기" : "장르 추가하기"}
      </DialogTitle>
      <DialogDescription>
        장르 정보를 입력해주세요.
      </DialogDescription>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={onSubmit} className={clsx("space-y-4", {
        "form-overlay": isFormSubmitting || isLoading
      })}>

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
    </Form>

    <DialogFooter className='justify-end'>
      <DialogClose asChild>
        <Button variant='ghost'>
          취소
        </Button>
      </DialogClose>
      <Button type="submit" disabled={!isValid || !isDirty || isFormSubmitting}
        onClick={() => onSubmit()}>
        {prev ? "수정" : "추가"}
      </Button>
    </DialogFooter>
  </>;
}