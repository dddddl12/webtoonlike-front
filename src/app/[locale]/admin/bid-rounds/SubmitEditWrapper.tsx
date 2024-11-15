"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ko, enUS } from "date-fns/locale";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose, DialogDescription
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Calendar } from "@/shadcn/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import {
  BidRoundAdminSettingsT,
  editBidRoundAdminSettings
} from "@/resources/bidRounds/bidRound.service";
import { useToast } from "@/shadcn/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Control, FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { formResolver } from "@/utils/forms";
import { BidRoundAdminSettingsSchema } from "@/resources/bidRounds/bidRound.types";
import Spinner from "@/components/Spinner";
import { FieldName, Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { clsx } from "clsx";
import { CalendarIcon } from "lucide-react";

export default function SubmitEditWrapper({
  bidRoundId, adminSettings,
}: {
  bidRoundId: number;
  adminSettings: BidRoundAdminSettingsT;
}) {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  async function handleSubmit(values: BidRoundAdminSettingsT): Promise<void> {
    try {
      checkBidRoundValidity(values);
      await editBidRoundAdminSettings(bidRoundId, values);
      toast({
        description: "투고 수정에 성공했습니다.",
        // variant: "success" TODO
      });
      window.location.reload();
    } catch (e) {
      if (e instanceof AdminSettingsError) {
        toast({
          description: e.message,
        });
        form.setError("root.custom",{
          type: "custom",
          message: e.message });
      }
    }
  }

  const form = useForm<BidRoundAdminSettingsT>({
    defaultValues: adminSettings,
    mode: "onChange",
    resolver: (values) => formResolver(BidRoundAdminSettingsSchema, values)
  });

  useEffect(() => {
    if (editorOpen) {
      form.reset(adminSettings);
    }
  }, [adminSettings, editorOpen, form]);

  return (
    <Dialog
      open={editorOpen}
      onOpenChange={setEditorOpen}
    >
      <DialogTrigger asChild>
        <Button>
          수정
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle/>
          <DialogDescription/>
        </VisuallyHidden>
        <AdminSettingsForm form={form} />
        <DialogFooter className="justify-end gap-2">
          <DialogClose asChild>
            <Button variant="red">
              취소
            </Button>
          </DialogClose>
          <Button variant="mint" onClick={form.handleSubmit(handleSubmit)}>
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminSettingsForm({ form }: {
  form: UseFormReturn<BidRoundAdminSettingsT>;
}) {
  const { formState: { isSubmitting, isSubmitSuccessful } } = form;
  if (isSubmitting || isSubmitSuccessful) {
    return <Spinner />;
  }
  return <Form {...form}>
    <form className="space-y-4">
      <CalendarFormField
        control={form.control}
        name="bidStartsAt"
        label="게시 시작일"/>
      <CalendarFormField
        control={form.control}
        name="negoStartsAt"
        label="선공개 종료일"/>
      <CalendarFormField
        control={form.control}
        name="processEndsAt"
        label="게시 종료일"/>
      <FormField
        control={form.control}
        name="adminNote"
        render={({ field }) => (
          <FormItem className="flex gap-4 items-center">
            <FormLabel className="w-[120px]">관리자 메모</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="flex-1"
                type='text'
                placeholder="관리자 메모"
              />
            </FormControl>
          </FormItem>
        )}
      />

    </form>
  </Form>;
}

export function CalendarFormField<TFieldValues extends FieldValues>({ control, name, label }: {
  control: Control<TFieldValues>;
  name: FieldName<TFieldValues, Date>;
  label: string;
}) {
  const nowLocale = useLocale();
  return <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex gap-4 items-center">
        <FormLabel className="w-[120px]">{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={clsx(
                  "flex-1",
                  !field.value && "text-muted-foreground"
                )}
              >
                <span>
                  {field.value?.toLocaleDateString(nowLocale) || "날짜를 선택해주세요."}
                </span>
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              locale={nowLocale === "ko" ? ko : enUS}
            />
          </PopoverContent>
        </Popover>
      </FormItem>
    )}
  />;
}

// TODO zod validator에 추가
class AdminSettingsError extends Error {}
function checkBidRoundValidity(adminSettings: BidRoundAdminSettingsT) {

  const { bidStartsAt, negoStartsAt, processEndsAt } = adminSettings;
  if (!bidStartsAt || !negoStartsAt || !processEndsAt) {
    throw new AdminSettingsError("누락된 날짜가 있습니다.");
  }
  if (bidStartsAt > negoStartsAt) {
    throw new AdminSettingsError("게시 시작일은 선공개 종료일보다 이전이어야 합니다.");
  }
  if (negoStartsAt > processEndsAt) {
    throw new AdminSettingsError("선공개 종료일은 게시 종료일보다 이전이어야 합니다.");
  }
}