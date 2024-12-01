import PageLayout from "@/components/ui/PageLayout";
import { WebtoonForm } from "@/components/forms/WebtoonForm";
import { listGenres } from "@/resources/genres/genre.controller";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";

export default async function CreateWebtoonPage() {
  const genres = await listGenres()
    .then(serverResponseHandler);
  return (
    <PageLayout>
      <WebtoonForm selectableGenres={genres}/>
    </PageLayout>
  );
}
