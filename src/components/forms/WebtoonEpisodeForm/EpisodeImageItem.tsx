import { Row } from "@/shadcn/ui/layouts";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { IconClose } from "@/components/svgs/IconClose";
import { useTranslations } from "next-intl";
import EpisodeImagePreview from "@/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import { FormControl, FormItem, FormLabel } from "@/shadcn/ui/form";
import { EpisodeImageSet } from "@/components/forms/WebtoonEpisodeForm/types";
import { useConfirm } from "@/hooks/alert";
import { Button } from "@/shadcn/ui/button";

export default function EpisodeImageItem({
  imageSet,
  removeHandler,
}: {
  imageSet: EpisodeImageSet;
  removeHandler: () => void;
}) {
  const t = useTranslations("episodeForm");
  const confirm = useConfirm({
    title: t("removeImageTitle"),
    message: t("removeImageDescription"),
    confirmText: t("removeConfirm"),
    onConfirm: removeHandler
  });

  return (
    <Row className="justify-between gap-3">
      <FormItem className="flex-1 flex gap-2 w-full">
        <FormControl>
          <Checkbox checked={imageSet.selected} />
        </FormControl>
        <FormLabel>{imageSet.image.displayUrl}</FormLabel>
      </FormItem>
      <Row className="flex gap-2 items-center text-sm">
        <EpisodeImagePreview imageSets={[imageSet]}>
          <span className="text-mint underline cursor-pointer">
            {t("preview")}
          </span>
        </EpisodeImagePreview>
        <Button size="smallIcon" asChild onClick={(e) => {
          e.preventDefault();
          confirm.open();
        }}>
          <IconClose className="fill-gray-text"/>
        </Button>
      </Row>
    </Row>
  );
}
