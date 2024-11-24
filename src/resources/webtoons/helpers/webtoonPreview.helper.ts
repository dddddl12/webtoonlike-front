import { Prisma } from "@prisma/client";
import { displayName } from "@/resources/displayName";
import { WebtoonPreviewT } from "@/resources/webtoons/dtos/webtoonPreview.dto";

class WebtoonPreviewHelper {
  query = Prisma.validator<Prisma.WebtoonDefaultArgs>()({
    select: {
      id: true,
      title: true,
      title_en: true,
      description: true,
      description_en: true,
      thumbPath: true,
    }
  });
  mapToDTO = (r: Prisma.WebtoonGetPayload<typeof this.query>, locale: string): WebtoonPreviewT => {
    return {
      id: r.id,
      thumbPath: r.thumbPath,
      localized: {
        title: displayName(locale, r.title, r.title_en),
        description: displayName(locale, r.description, r.description_en),
      }
    };
  };

}

const webtoonPreviewHelper = new WebtoonPreviewHelper();
export default webtoonPreviewHelper;