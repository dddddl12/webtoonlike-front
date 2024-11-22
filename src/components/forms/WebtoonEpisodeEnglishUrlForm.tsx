"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { useToast } from "@/shadcn/hooks/use-toast";
import { updateEpisodeEnglishUrl } from "@/resources/webtoonEpisodes/webtoonEpisode.controller";
import useSafeHookFormAction from "@/hooks/safeHookFormAction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WebtoonEpisodeEnglishUrlFormSchema,
  WebtoonEpisodeT
} from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Row } from "@/shadcn/ui/layouts";
import { clsx } from "clsx";

export default function WebtoonEpisodeEnglishUrlForm({ episode }:{
  episode: WebtoonEpisodeT;
}) {
  const t = useTranslations("episodePage.administratorFeatures");
  const { toast } = useToast();
  const { form, handleSubmitWithAction } = useSafeHookFormAction(
    updateEpisodeEnglishUrl.bind(null, episode.webtoonId, episode.id),
    zodResolver(WebtoonEpisodeEnglishUrlFormSchema),
    {
      actionProps: {
        onSuccess: (args) => {
          form.reset(args.input);
          // 폼 제출 후 재수정 가능해야 하므로 리셋
          // 리셋하지 않으면 disabled 상태가 유지됨
          toast({
            description: t("success")
          });
        }
      },
      formProps: {
        defaultValues: episode,
        mode: "onChange",
      }
    }
  );

  const { formState: { isValid, isSubmitting } } = form;

  return <Form {...form}>
    <form onSubmit={handleSubmitWithAction} className={clsx("w-full gap-5", {
      "form-overlay": isSubmitting
    })}>
      <FormField
        control={form.control}
        name="englishUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {t("addEpisodeURLheader")}
            </FormLabel>
            <Row className="gap-5">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("addEnglishEpisodeURLPlaceholder")}
                />
              </FormControl>
              <Button type="submit" variant="mint"
                disabled={!isValid}
              >
                {t("register")}
              </Button>
            </Row>
            <FormMessage/>
          </FormItem>
        )}/>
    </form>
  </Form>;
}
