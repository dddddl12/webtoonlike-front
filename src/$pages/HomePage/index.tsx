import { PopularCarousel } from "./PopularCarousel";
import { Gap } from "@/ui/layouts";
import * as WebtoonApi from "@/apis/webtoons";
import * as CreatorApi from "@/apis/creators";
import { getTranslations } from "next-intl/server";
import SectionHeading from "@/$pages/HomePage/SectionHeading";
import WebtoonGrid from "@/$pages/HomePage/WebtoonGrid";
import ArtistGrid from "@/$pages/HomePage/ArtistGrid";


export async function HomePage() {
  const t = await getTranslations("homeMain");

  const [homeWebtoonItems, { data: artists }] = await Promise.all([
    WebtoonApi.homeItems(),
    CreatorApi.list({
      $numWebtoon: true,
      exposed: "only", // TODO 보안 체크
      limit: 5
    })
  ]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-start'>
      <Gap y="36px"/>
      {/* <BannerSection />
      <Gap y={40} /> */}
      {/*  TODO 디자인 미세조정 */}
      <section className="w-full">
        <PopularCarousel webtoons={homeWebtoonItems.popular}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedPopularSeries")}/>
        <WebtoonGrid webtoons={homeWebtoonItems.recommendations}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedNewSeries")}/>
        <WebtoonGrid webtoons={homeWebtoonItems.brandNew}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("organizedByGenre")}/>
        <WebtoonGrid webtoons={homeWebtoonItems.perGenre}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        {/* TODO 작가 페이지 있는지 확인*/}
        <SectionHeading path="/artists" title={t("recommendedCreators")}/>
        <ArtistGrid artists={artists}/>
      </section>
      <Gap y={40}/>
      {/* <SignedIn>
        <Row>
          Render after signed in section
        </Row>
      </SignedIn> */}

      {/* <ClientTest/> */}
    </main>
  );
}
