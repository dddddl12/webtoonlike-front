import { serverResponseHandler } from "@/handlers/serverResponseHandler";
import { getWebtoonDetailsExtended } from "@/resources/webtoons/controllers/webtoonDetails.controller";
import WebtoonPageContents from "@/components/shared/WebtoonPageContents";

export default async function WebtoonDetailsPage({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const webtoonId = await params.then(({ webtoonId }) => Number(webtoonId));

  const webtoon = await getWebtoonDetailsExtended(webtoonId)
    .then(serverResponseHandler);
  return <WebtoonPageContents webtoon={webtoon} />;
}
