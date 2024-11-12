import { getLocale, getTranslations } from "next-intl/server";
import SectionHeading from "@/components/HomePage/SectionHeading";
import WebtoonGrid from "@/components/HomePage/WebtoonGrid";
import CreatorGrid from "@/components/HomePage/CreatorGrid";
import BannerSection from "@/components/HomePage/BannerSection";
import PageLayout from "@/components/PageLayout";
import { homeItems } from "@/resources/home/home.service";
import GenreWrapper from "@/components/HomePage/GenreWrapper";

export async function HomePage() {
  const t = await getTranslations("homeMain");

  const { banners, popular, brandNew, genreSets, creators } = await homeItems();
  const locale = await getLocale();

  return (
    <PageLayout className="flex flex-col gap-20">
      <section className="w-full">
        <SectionHeading title={t("contentNearingDeadline")}/>
        <BannerSection banners={banners}/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedNewSeries", {
          month: new Date().toLocaleString(locale, { month: "long" })
        })}/>
        <WebtoonGrid webtoons={brandNew}/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("recommendedPopularSeries")}/>
        <WebtoonGrid webtoons={popular}/>
      </section>
      <section className="w-full">
        <SectionHeading path="/webtoons" title={t("organizedByGenre")}/>
        <GenreWrapper
          genres={genreSets.genres}
          firstGenreItems={genreSets.firstGenreItems}
        />
      </section>
      <section className="w-full">
        <SectionHeading title={t("recommendedCreators")}/>
        <CreatorGrid creators={creators}/>
      </section>
    </PageLayout>
  );
}
