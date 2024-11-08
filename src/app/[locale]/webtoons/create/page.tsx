import PageLayout from "@/components/PageLayout";
import { WebtoonForm } from "@/app/[locale]/webtoons/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.service";

export default async function CreateWebtoonPage() {
  const genres = await listGenres();
  return (
    <PageLayout>
      <WebtoonForm selectableGenres={genres}/>
    </PageLayout>
  );
}

// TODO
// async function handleSubmit(form: WebtoonFormT, xData: {genres?: GenreT[]}) {
//   try {
//     const created = await WebtoonApi.create(form);
//     await Promise.all(xData.genres?.map((genre) => XWebttonGenreApi.create({ webtoonId: created.id, genreId: genre.id })) ?? []);
//     enqueueSnackbar("webtoon successfully created", { variant: "success" });
//     router.replace(`/webtoons/${created.id}`);
//     router.refresh();
//   } catch (e) {
//     enqueueSnackbar("webtoon create failed", { variant: "error" });
//     console.warn(e);
//   }
// }
//
