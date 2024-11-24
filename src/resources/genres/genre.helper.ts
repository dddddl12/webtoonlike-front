import "server-only";
import { Genre as GenreRecord } from "@prisma/client";
import { GenreT } from "@/resources/genres/genre.dto";
import { displayName } from "@/resources/displayName";

class GenreHelper {
  mapToDto = (r: GenreRecord, locale: string): GenreT => ({
    id: r.id,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    label: r.label,
    label_en: r.label_en ?? undefined,
    rank: r.rank ?? undefined,
    localized: {
      label: displayName(locale, r.label, r.label_en)
    }
  });
}

const genreHelper = new GenreHelper();
export default genreHelper;