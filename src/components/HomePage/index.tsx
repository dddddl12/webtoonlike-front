import { getTranslations } from "next-intl/server";
import SectionHeading from "@/components/HomePage/SectionHeading";
import WebtoonGrid from "@/components/HomePage/WebtoonGrid";
import ArtistGrid from "@/components/HomePage/ArtistGrid";
import BannerSection from "@/components/HomePage/BannerSection";
import { homeItems } from "@/resources/webtoons/webtoon.service";
import PageLayout from "@/components/PageLayout";

export async function HomePage() {
  const t = await getTranslations("homeMain");

  const { popular, brandNew, perGenre, artists } = await homeItems();

  return (
    <PageLayout className="flex flex-col gap-20">
      <section className="w-full">
        <SectionHeading title={t("contentNearingDeadline")}/>
        <BannerSection/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedPopularSeries")}/>
        <WebtoonGrid webtoons={popular} numbered={true} cols={4} height={420}/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedNewSeries")}/>
        <WebtoonGrid webtoons={brandNew} cols={5} height={330}/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("organizedByGenre")}/>
        <WebtoonGrid webtoons={perGenre} cols={5} height={220}/>
      </section>
      <section className="w-full">
        <SectionHeading title={t("recommendedCreators")}/>
        <ArtistGrid artists={artists}/>
      </section>
    </PageLayout>
  );
}
