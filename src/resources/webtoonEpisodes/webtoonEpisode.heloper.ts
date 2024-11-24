import "server-only";
import { WebtoonEpisode as WebtoonEpisodeRecord } from "@prisma/client";
import { WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.dto";

class WebtoonEpisodeHeloper {
  mapToDTO = (record: WebtoonEpisodeRecord): WebtoonEpisodeT => ({
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    webtoonId: record.webtoonId,
    episodeNo: record.episodeNo,
    imagePaths: record.imagePaths as string[]
  });
}

const webtoonEpisodeHelper = new WebtoonEpisodeHeloper();
export default webtoonEpisodeHelper;