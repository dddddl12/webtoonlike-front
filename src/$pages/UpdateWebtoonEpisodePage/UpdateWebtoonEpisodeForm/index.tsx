"use client";

import { useRouter } from "@/i18n/routing";
import { WebtoonEpisodeForm } from "@/components/WebtoonEpisodeForm";
import { useSnackbar } from "@/hooks/Snackbar";

type UpdateWebtoonPostFormProps = {
  episode: WebtoonEpisodeT;
};

export function UpdateWebtoonPostForm({ episode }: UpdateWebtoonPostFormProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();


  async function handleSubmit(
    form: WebtoonEpisodeFormT,
    images: WebtoonEpisodeImageFormT[]
  ): Promise<void> {
    try {
      const updated = await WebtoonEpisodeApi.update(episode.id, form, { images });

      enqueueSnackbar("post successfully updated", { variant: "success" });

      // router.push(`/webtoons/${updated.webtoonId}/episodes/${updated.id}`);
      router.push(`/webtoons/${updated.webtoonId}`);
    } catch (e: any) {
      if (e.response.data.code === "ALREADY_EXIST") {
        enqueueSnackbar("이미 등록한 회차 번호는 사용할 수 없습니다.", { variant: "error" });
      } else {
        enqueueSnackbar("webtoon update failed", { variant: "error" });
      }
      console.warn(e);
    }
  }

  return (
    <WebtoonEpisodeForm
      webtoonId={episode.webtoonId}
      episode={episode}
      onSubmit={handleSubmit}
    />
  );
}
