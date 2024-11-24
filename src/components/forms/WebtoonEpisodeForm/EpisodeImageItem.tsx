import { Row } from "@/components/ui/common";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { IconClose } from "@/components/svgs/IconClose";
import { useTranslations } from "next-intl";
import EpisodeImagePreview from "@/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import { FormControl, FormItem, FormLabel } from "@/shadcn/ui/form";
import { useConfirm } from "@/hooks/alert";
import { Button } from "@/shadcn/ui/button";
import { EpisodeImageObject } from "@/components/forms/WebtoonEpisodeForm/hook";

export default function EpisodeImageItem({
  image,
  select,
  remove,
}: {
  image: EpisodeImageObject;
  select: (value: boolean) => void;
  remove: () => void;
}) {
  const t = useTranslations("episodeForm");
  const confirm = useConfirm({
    title: t("removeImageTitle"),
    message: t("removeImageDescription"),
    confirmText: t("removeConfirm"),
    onConfirm: remove
  });

  return (
    <Row className="justify-between gap-3">
      <FormItem className="flex-1 flex gap-2 overflow-hidden">
        <FormControl>
          <Checkbox
            checked={image.selected}
            onCheckedChange={select}
          />
        </FormControl>
        <FormLabel className="whitespace-pre overflow-ellipsis overflow-hidden">
          {image.displayUrl}
        </FormLabel>
      </FormItem>
      <Row className="flex gap-2 items-center text-sm">
        <EpisodeImagePreview images={[image]}>
          <span className="clickable">
            {t("preview")}
          </span>
        </EpisodeImagePreview>
        <Button size="smallIcon" variant="ghost" asChild onClick={(e) => {
          e.preventDefault();
          confirm.open();
        }}>
          <IconClose className="fill-gray-text"/>
        </Button>
      </Row>
    </Row>
  );
}
