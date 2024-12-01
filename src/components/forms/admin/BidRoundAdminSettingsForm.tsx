import { ReactNode, useEffect, useMemo, useState } from "react";
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
import { useToast } from "@/shadcn/hooks/use-toast";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Control, FieldValues } from "react-hook-form";
import {
  BidRoundApprovalStatus,
} from "@/resources/bidRounds/dtos/bidRound.dto";
import { FieldName, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { clsx } from "clsx";
import { CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Col } from "@/components/ui/common";
import { getBidRoundStatus } from "@/resources/bidRounds/bidRoundStatus";
import {
  StrictBidRoundAdminSettingsSchema
} from "@/resources/bidRounds/dtos/bidRoundAdmin.dto";
import {
  editBidRoundAdminSettings,
  getBidRoundAdminSettings
} from "@/resources/bidRounds/controllers/bidRoundAdmin.controller";
import useSafeActionForm from "@/hooks/safeActionForm";
import useSafeAction from "@/hooks/safeAction";

export default function BidRoundAdminSettingsForm({
  bidRoundId, children, reload
}: {
  bidRoundId: number;
  children: ReactNode;
  reload: () => void;
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
        <DialogContentWrapper bidRoundId={bidRoundId}
          reload={reload}/>
      </DialogContent>
    </Dialog>
  );
}

function DialogContentWrapper({
  bidRoundId, reload
}: {
  bidRoundId: number;
  reload: () => void;
}) {
  const { toast } = useToast();
  const { isFormSubmitting, form, onSubmit } = useSafeActionForm(
    editBidRoundAdminSettings.bind(null, bidRoundId), {
      resolver: zodResolver(StrictBidRoundAdminSettingsSchema),
      mode: "onChange",
      actionProps: {
        onSuccess: () => {
          toast({
            description: "투고 수정에 성공했습니다.",
          });
          reload();
        }
      }
    });
  const { formState: { isValid, isDirty } } = form;

  // getBidRoundAdminSettings vs. StrictBidRoundAdminSettingsSchema 타입 불일치로 인해
  // defaultValues 사용 불가 (이상하게 async 호출 시 partial 조건이 빠져있음)
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const boundGetBidRoundAdminSettings = useMemo(() => getBidRoundAdminSettings.bind(null, bidRoundId), [bidRoundId]);
  const { execute } = useSafeAction(boundGetBidRoundAdminSettings, {
    onSuccess: ({ data }) => {
      form.reset(data);
      setIsLoaded(true);
    }
  });
  useEffect(() => {
    execute();
  }, [execute]);

  const { watch } = form;

  const t = useTranslations("bidRoundStatus");
  const { bidStartsAt, negoStartsAt, processEndsAt } = watch();
  const statusLabel = isValid ? t(getBidRoundStatus({
    bidStartsAt, negoStartsAt, processEndsAt,
    approvalStatus: BidRoundApprovalStatus.Approved
  })) : "-";

  return <>
    <VisuallyHidden>
      <DialogTitle/>
      <DialogDescription/>
    </VisuallyHidden>
    <Form {...form} schema={StrictBidRoundAdminSettingsSchema}>
      <form onSubmit={onSubmit} className={clsx("space-y-4 mt-4", {
        "form-overlay": isFormSubmitting || !isLoaded
      })}>
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
        <FormItem forcedIsInline={true}>
          <FormLabel className="w-[120px]">투고 상태(자동 설정)</FormLabel>
          <Col className="flex-1">
            <Input
              className="flex-1"
              type="text"
              disabled={true}
              value={statusLabel}
            />
          </Col>
        </FormItem>
        <FormField
          control={form.control}
          name="adminNote"
          render={({ field }) => (
            <FormItem forcedIsInline={true}>
              <FormLabel className="w-[120px]">관리자 메모</FormLabel>
              <Col className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    className="flex-1"
                    type="text"
                    placeholder="관리자 메모"
                  />
                </FormControl>
                <FormMessage/>
              </Col>
            </FormItem>
          )}
        />
      </form>
    </Form>
    <DialogFooter className="justify-end gap-2">
      <DialogClose asChild>
        <Button variant="red">
          취소
        </Button>
      </DialogClose>
      <Button
        variant="mint"
        onClick={() => onSubmit()}
        disabled={!isValid || !isDirty || isFormSubmitting}
      >
        적용
      </Button>
    </DialogFooter>
  </>;
}

function CalendarFormField<TFieldValues extends FieldValues>({ control, name, label }: {
  control: Control<TFieldValues>;
  name: FieldName<TFieldValues, Date>;
  label: string;
}) {
  const nowLocale = useLocale();
  return <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem forcedIsInline={true}>
        <FormLabel className="w-[120px]">{label}</FormLabel>
        <FormControl>
          <Input {...field} type="hidden" />
        </FormControl>
        <Col className="flex-1">
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
