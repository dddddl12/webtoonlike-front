import { getLocale, getTranslations } from "next-intl/server";
import SectionHeading from "@/components/root/HomePage/SectionHeading";
import WebtoonGrid from "@/components/root/HomePage/WebtoonGrid";
import CreatorGrid from "@/components/root/HomePage/CreatorGrid";
import BannerSection from "@/components/root/HomePage/BannerSection";
import PageLayout from "@/components/ui/PageLayout";
import { homeItems } from "@/resources/home/home.controller";
import GenreWrapper from "@/components/root/HomePage/GenreWrapper";
import { serverResponseHandler } from "@/handlers/serverResponseHandler";

export async function HomePage() {
  const t = await getTranslations("homeMain");

  const { banners, popular, brandNew, genreSets, creators } = await homeItems().then(serverResponseHandler);
  const locale = await getLocale();

  return (
    <PageLayout className="flex flex-col gap-20">
      <section className="w-full">
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
