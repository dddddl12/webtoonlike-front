import { Row } from "@/shadcn/ui/layouts";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { IconClose } from "@/components/svgs/IconClose";
import { useTranslations } from "next-intl";
import EpisodeImagePreview from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/EpisodeImagePreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { FormControl, FormItem, FormLabel } from "@/shadcn/ui/form";
import { EpisodeImageSet } from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/types";

export default function EpisodeImageItem({
  imageSet,
  removeHandler,
}: {
  imageSet: EpisodeImageSet;
  removeHandler: () => void;
}) {
  const t = useTranslations("episodeForm");

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
        <RemoveButton removeHandler={removeHandler}/>
      </Row>
    </Row>
  );
}

function RemoveButton({ removeHandler }: {
  removeHandler: () => void;
}) {
  const t = useTranslations("episodeForm");
  const tGeneral = useTranslations("general");
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <IconClose className="fill-gray-text"/>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("removeImageTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("removeImageDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tGeneral("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={removeHandler}>{t("removeConfirm")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
