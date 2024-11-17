import PageLayout from "@/components/PageLayout";
import { WebtoonForm } from "@/app/[locale]/webtoons/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.service";
import { responseHandler } from "@/handlers/responseHandler";

export default async function CreateWebtoonPage() {
  const genres = await listGenres()
    .then(responseHandler);
  return (
    <PageLayout>
      <WebtoonForm selectableGenres={genres}/>
    </PageLayout>
  );
}
