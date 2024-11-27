import "server-only";
import { Webtoon as WebtoonRecord } from "@prisma/client";
import {
  AgeLimit,
  TargetAge,
  TargetGender,
  WebtoonT
} from "@/resources/webtoons/dtos/webtoon.dto";
import webtoonPreviewHelper from "@/resources/webtoons/helpers/webtoonPreview.helper";

// TODO semi-graphql
class WebtoonHelper {
  mapToDTO = (r: WebtoonRecord, locale: string): WebtoonT => {
    return {
      ...webtoonPreviewHelper.mapToDTO(r, locale),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      title: r.title,
      title_en: r.title_en,
      description: r.description ?? undefined,
      description_en: r.description_en ?? undefined,
      authorName: r.authorName ?? undefined,
      authorName_en: r.authorName_en ?? undefined,
      externalUrl: r.externalUrl ?? undefined,
      targetAges: r.targetAges
        .map(a => a as TargetAge),
      ageLimit: r.ageLimit as AgeLimit,
      // TODO 이것이 표시가 되던가?
      targetGender: r.targetGender as TargetGender,
      thumbPath: r.thumbPath,
    };
  };
}

const webtoonHelper = new WebtoonHelper();
export default webtoonHelper;
