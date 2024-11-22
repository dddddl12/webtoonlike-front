import PageLayout from "@/components/PageLayout";
import { WebtoonForm } from "@/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.controller";
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
