import { BannerSection } from "./BannerSection";
import { PopularCarouselSection } from "./PopularCarouselSection";
import { Gap } from "@/ui/layouts";
import ArtistCarouselSection from "./ArtistCarouselSection";
import PerGenreCarouselSection from "./PerGenreCarouselSection";
import RecommendCarouselSection from "./RecommendCarouselSection";
import BrandNewCarouselSection from "./BrandNewCarouselSection";
// import { getDictionary } from '@/i18n/getDictionary';
// import { Button } from '@/ui/Button';
// import {ClientTest} from '@/components/_ClientTest'


export function HomePage() {
  // const user = await currentUser();
  // const i18n = await getDictionary(lang);

  return (
    <main className='flex min-h-screen flex-col items-center justify-start'>
      {/* <BannerSection />
      <Gap y={40} /> */}
      <PopularCarouselSection />
      <Gap y={40} />
      <RecommendCarouselSection />
      <Gap y={40} />
      <BrandNewCarouselSection />
      <Gap y={40} />
      <PerGenreCarouselSection />
      <Gap y={40} />
      <ArtistCarouselSection />
      <Gap y={40} />
      {/* <SignedIn>
        <Row>
          Render after signed in section
        </Row>
      </SignedIn> */}

      {/* <ClientTest/> */}
    </main>
  );
}
