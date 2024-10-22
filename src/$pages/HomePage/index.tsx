import { Gap } from "@/ui/layouts";
import { getTranslations } from "next-intl/server";
import SectionHeading from "@/$pages/HomePage/SectionHeading";
import WebtoonGrid from "@/$pages/HomePage/WebtoonGrid";
import ArtistGrid from "@/$pages/HomePage/ArtistGrid";
import BannerSection from "@/$pages/HomePage/BannerSection";
import { homeItems } from "@/resources/webtoons/webtoon.service";


export async function HomePage() {
  const t = await getTranslations("homeMain");

  const { popular, brandNew, perGenre, artists } = await homeItems();

  return (
    <main className='flex min-h-screen flex-col items-center justify-start'>
      <Gap y="36px"/>
      <BannerSection />
      <Gap y={40} />
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedPopularSeries")}/>
        <WebtoonGrid webtoons={popular}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedNewSeries")}/>
        <WebtoonGrid webtoons={brandNew}/>
      </section>
      <Gap y={40}/>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("organizedByGenre")}/>
        <WebtoonGrid webtoons={perGenre}/>
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
