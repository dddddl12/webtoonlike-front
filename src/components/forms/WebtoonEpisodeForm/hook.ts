import { useState } from "react";
import { useToast } from "@/shadcn/hooks/use-toast";

import { ImageObject } from "@/utils/media";
import { useTranslations } from "next-intl";

export class EpisodeImageObject extends ImageObject {
  private _selected: boolean;

  declare url: string;
  declare displayUrl: string;

  constructor(fileOrPath: File | string) {
    super(fileOrPath, "md");
    this._selected = false;

    if (!this.url || !this.displayUrl) {
      throw new Error("url must always be defined in EpisodeImageObject");
    }
  }
  get selected() {
    return this._selected;
  }
  select(value: boolean) {
    this._selected = value;
  }
}

export type ImageList = ReturnType<typeof useEpisodeImageList>;
export function useEpisodeImageList(paths?: string[]) {
  const initImages = paths?.map(path => new EpisodeImageObject(path)) ?? [];
  const [episodeImages, setEpisodeImages] = useState<EpisodeImageObject[]>(initImages);
  const select = (index: number, value: boolean) => {
    setEpisodeImages((prev) => {
      prev[index].select(value);
      return [...prev];
    });
  };
  const remove = (index: number) => {
    setEpisodeImages((prev) =>
      prev.filter((_, thisIndex) => index !== thisIndex)
    );
  };
  const add = (files: File[]) =>
    setEpisodeImages((prev) => [
      ...prev,
      ...files.map((file) => new EpisodeImageObject(file)),
    ]);

  const { toast } = useToast();
  const t = useTranslations("episodeForm");
  const reorder = (isUp: boolean) => {
    try {
      const newEpisodeImages = reorderImages(episodeImages, isUp);
      setEpisodeImages([...newEpisodeImages]);
    } catch (e) {
      if (!(e instanceof ReorderImagesError)) {
        throw e;
      }
      toast({
        description: t("noConsecutiveImagesWarning")
      });
    }
  };
  return { episodeImages, select, remove, add, reorder };
}

class ReorderImagesError extends Error {}
const reorderImages = (
  images: EpisodeImageObject[],
  isUp: boolean,
) => {
  const { firstIndex, lastIndex } = getSelectedImagesIndices(images);

  if (firstIndex < 0 || lastIndex < 0) {
    // 선택한 것이 없을 때
    return images;
  }

  if (isUp && firstIndex > 0) {
    // Move to up
    const imageToMove = images.splice(firstIndex - 1, 1)[0];
    images.splice(lastIndex, 0, imageToMove);
  } else if (!isUp && lastIndex < images.length - 1) {
    // Move to down
    const imageToMove = images.splice(lastIndex + 1, 1)[0];
    images.splice(firstIndex, 0, imageToMove);
  }

  return images;
};

const getSelectedImagesIndices = (images: EpisodeImageObject[]) => {
  return images.reduce((acc, image, index) => {
    if (!image.selected) {
      return acc;
    }
    if (acc.firstIndex < 0){
      acc.firstIndex = index;
    }
    if (acc.lastIndex >= 0 && index > acc.lastIndex + 1 ){
      throw new ReorderImagesError();
    }
    acc.lastIndex = index;
    return acc;
  }, {
    firstIndex: -1,
    lastIndex: -1
  } as {
    firstIndex: number;
    lastIndex: number;
  });
};