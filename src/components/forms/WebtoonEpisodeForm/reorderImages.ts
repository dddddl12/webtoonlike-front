import { EpisodeImageSet } from "@/components/forms/WebtoonEpisodeForm/types";

export class ReorderImagesError extends Error {}

export const reorderImages = (
  imageSets: EpisodeImageSet[],
  isUp: boolean,
) => {
  const { firstIndex, lastIndex } = getSelectedImagesIndexes(imageSets);

  if (isUp && firstIndex > 0) {
    // Move to up
    const imageSetToMove = imageSets.splice(firstIndex - 1, 1)[0];
    imageSets.splice(lastIndex, 0, imageSetToMove);
  } else if (!isUp && lastIndex < imageSets.length - 1) {
    // Move to down
    const imageSetToMove = imageSets.splice(lastIndex + 1, 1)[0];
    imageSets.splice(firstIndex, 0, imageSetToMove);
  }

  return imageSets;
};

const getSelectedImagesIndexes = (imageSets: EpisodeImageSet[]) => {
  return imageSets.reduce((acc, imageSet, index) => {
    if (!imageSet.selected) {
      return acc;
    }
    if (acc.firstIndex < 0){
      acc.firstIndex = index;
    }
    if (index > acc.lastIndex + 1 ){
      throw new ReorderImagesError("연속되지 않은 항목들은 이동할 수 없습니다. 연속되는 항목들만 선택해 주세요");
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