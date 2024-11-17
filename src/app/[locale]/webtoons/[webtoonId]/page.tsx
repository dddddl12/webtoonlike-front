import WebtoonPageContents from "../components/WebtoonPageContents";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";
import { responseHandler } from "@/handlers/responseHandler";

export default async function WebtoonDetailsPage({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const webtoonId = await params.then(({ webtoonId }) => Number(webtoonId));

  const webtoon = await getWebtoon(webtoonId)
    .then(responseHandler);
  return <WebtoonPageContents webtoon={webtoon} />;
}
