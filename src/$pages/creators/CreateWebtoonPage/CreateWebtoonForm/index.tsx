"use client";

import { useRouter } from "@/i18n/routing";
import { useSnackbar } from "notistack";
import { WebtoonForm } from "@/components/WebtoonForm";
import * as WebtoonApi from "@/apis/webtoons";
import * as XWebttonGenreApi from "@/apis/x_webtoon_genres";
import type { WebtoonFormT } from "@backend/types/Webtoon";
import type { GenreT } from "@backend/types/Genre";

export function CreateWebtoonForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(form: WebtoonFormT, xData: {genres?: GenreT[]}) {
    try {
      const created = await WebtoonApi.create(form);
      await Promise.all(xData.genres?.map((genre) => XWebttonGenreApi.create({ webtoonId: created.id, genreId: genre.id })) ?? []);
      enqueueSnackbar("webtoon successfully created", { variant: "success" });
      router.replace(`/webtoons/${created.id}`);
      router.refresh();
    } catch (e) {
      enqueueSnackbar("webtoon create failed", { variant: "error" });
      console.warn(e);
    }
  }

  return <WebtoonForm onSubmit={handleSubmit} />;
}
