"use client";

import { useRouter } from "@/i18n/routing";
import { WebtoonEpisodeForm } from "@/components/WebtoonEpisodeForm";
import { useSnackbar } from "@/hooks/Snackbar";
import { WebtoonEpisodeFormT, WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";
import { WebtoonEpisodeImageFormT } from "@/resources/webtoonEpisodeImages/webtoonEpisodeImage.types";

export function UpdateWebtoonPostForm({ episode }: {
  episode: WebtoonEpisodeT;
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();


  async function handleSubmit(
    form: WebtoonEpisodeFormT,
    images: WebtoonEpisodeImageFormT[]
  ): Promise<void> {
    // const updated = await WebtoonEpisodeApi.update(episode.id, form, { images });
    //
    // enqueueSnackbar("post successfully updated", { variant: "success" });
    //
    // // router.push(`/webtoons/${updated.webtoonId}/episodes/${updated.id}`);
    // router.push(`/webtoons/${updated.webtoonId}`);
  }

  return (
    <WebtoonEpisodeForm
      webtoonId={episode.webtoonId}
      episode={episode}
      onSubmit={handleSubmit}
    />
  );
}
