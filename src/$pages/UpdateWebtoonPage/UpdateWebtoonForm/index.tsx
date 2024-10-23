"use client";

import { useRouter } from "@/i18n/routing";
import { useSnackbar } from "@/hooks/Snackbar";
import { WebtoonForm } from "@/components/WebtoonForm";


type UpdateWebtoonProps = {
  webtoon: WebtoonT;
};

export function UpdateWebtoonForm({ webtoon }: UpdateWebtoonProps) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: WebtoonFormT, xData: {genres?: GenreT[]}) {
    try {
      await WebtoonApi.update(webtoon.id, form);
      await XWebttonGenreApi.resetByWebtoon(webtoon.id);
      await Promise.all(xData.genres?.map((genre) => XWebttonGenreApi.create({ webtoonId: webtoon.id, genreId: genre.id })) ?? []);
      enqueueSnackbar("webtoon successfully updated", {
        variant: "success",
      });
      router.replace(`/webtoons/${webtoon.id}`);
      router.refresh();
    } catch (e: any) {
      if (e.response.data.message === "user is forbidden to process requested action") {
        enqueueSnackbar("본인 소유의 작품만 수정이 가능합니다.", { variant: "error" });
        return;
      }
      enqueueSnackbar("작품 수정에 실패했습니다.", { variant: "error" });
      console.warn(e);
    }
  }

  return <WebtoonForm webtoon={webtoon} onSubmit={handleSubmit} />;
}
