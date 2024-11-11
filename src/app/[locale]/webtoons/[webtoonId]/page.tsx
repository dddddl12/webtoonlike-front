import WebtoonPageContents from "../components/WebtoonPageContents";
import { getWebtoon } from "@/resources/webtoons/webtoon.service";

export default async function WebtoonDetailsPage({ params }:
{ params: Promise<{ webtoonId: string }> }) {
  const { webtoonId } = await params;

  const webtoon = await getWebtoon(Number(webtoonId));
  return <WebtoonPageContents webtoon={webtoon} />;
}
