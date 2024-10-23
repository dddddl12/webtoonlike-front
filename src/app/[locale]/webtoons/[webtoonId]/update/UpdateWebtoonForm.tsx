"use client";

import { useRouter } from "@/i18n/routing";
import { useSnackbar } from "@/hooks/Snackbar";
import { WebtoonForm } from "@/components/WebtoonForm";
import { WebtoonFormT, WebtoonT } from "@/resources/webtoons/webtoon.types";
import { GenreT } from "@/resources/genres/genre.types";

export function UpdateWebtoonForm({ webtoon }: {
  webtoon: WebtoonT;
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: WebtoonFormT, xData: {genres?: GenreT[]}) {
    // await WebtoonApi.update(webtoon.id, form);
    // await XWebttonGenreApi.resetByWebtoon(webtoon.id);
    // await Promise.all(xData.genres?.map((genre) => XWebttonGenreApi.create({ webtoonId: webtoon.id, genreId: genre.id })) ?? []);
    // enqueueSnackbar("webtoon successfully updated", {
    //   variant: "success",
    // });
    router.replace(`/webtoons/${webtoon.id}`);
    router.refresh();
  }

  return <WebtoonForm webtoon={webtoon} onSubmit={handleSubmit} />;
}
