"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
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
import { editBidRoundAdminSettings } from "@/resources/bidRounds/bidRound.service";
import { useToast } from "@/shadcn/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";
import {
  BidRoundAdminSettingsT,
  BidRoundApprovalStatus,
  StrictBidRoundAdminSettingsSchem, StrictBidRoundAdminSettingsT
} from "@/resources/bidRounds/bidRound.types";
import Spinner from "@/components/Spinner";
import { FieldName, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { clsx } from "clsx";
import { CalendarIcon } from "lucide-react";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col } from "@/shadcn/ui/layouts";
import { getBidRoundStatus } from "@/resources/bidRounds/bidRoundStatus";

export default function SubmitEditWrapper({
  bidRoundId, adminSettings,
}: {
  bidRoundId: number;
  adminSettings: BidRoundAdminSettingsT;
}) {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const { form, handleSubmitWithAction }
    = useSafeHookFormAction(
      editBidRoundAdminSettings.bind(null, bidRoundId),
      zodResolver(StrictBidRoundAdminSettingsSchem),
      {
        actionProps: {
          onSuccess: () => {
            toast({
              description: "투고 수정에 성공했습니다.",
              // variant: "success" TODO
            });
            window.location.reload();
          }
        },
        formProps: {
          defaultValues: adminSettings,
          mode: "onChange",
        }
      }
    );

  const { formState: { isValid } } = form;
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
          <Button
            variant="mint"
            onClick={handleSubmitWithAction}
            disabled={!isValid}
          >
            적용
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminSettingsForm({ form }: {
  form: UseFormReturn<StrictBidRoundAdminSettingsT>;
}) {
  const t = useTranslations("bidRoundStatus");
  const { formState: { isSubmitting, isSubmitSuccessful, isValid }, watch } = form;
  const { bidStartsAt, negoStartsAt, processEndsAt } = watch();
  const statusLabel = isValid ? t(getBidRoundStatus({
    bidStartsAt, negoStartsAt, processEndsAt,
    approvalStatus: BidRoundApprovalStatus.Approved
  })) : "-";
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
      <FormItem className="flex gap-4 items-center">
        <FormLabel className="w-[120px]">투고 상태(자동 설정)</FormLabel>
        <Col className="flex-1 gap-1">
          <Input
            className="flex-1"
            type='text'
            disabled={true}
            value={statusLabel}
          />
        </Col>
      </FormItem>
      <FormField
        control={form.control}
        name="adminNote"
        render={({ field }) => (
          <FormItem className="flex gap-4 items-center">
            <FormLabel className="w-[120px]">관리자 메모</FormLabel>
            <Col className="flex-1 gap-1">
              <FormControl>
                <Input
                  {...field}
                  className="flex-1"
                  type='text'
                  placeholder="관리자 메모"
                />
              </FormControl>
              <FormMessage/>
            </Col>
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
        <FormControl>
          <Input {...field} type="hidden" />
        </FormControl>
        <Col className="flex-1 gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={clsx(
                  "flex-1",
                  !field.value && "text-muted-foreground"
                )}>
                <span>
                  {field.value?.toLocaleDateString(nowLocale) || "날짜를 선택해주세요."}
                </span>
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
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
          <FormMessage/>
        </Col>
      </FormItem>
    )}
  />;
}
