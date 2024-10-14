import React, { Suspense } from "react";
import { Container } from "@/ui/layouts";
import { EpisodeDetail } from "./EpisodeDetail";
import Spinner from "@/components/Spinner";
import type { WebtoonT } from "@backend/types/Webtoon";
import type { WebtoonEpisodeT } from "@backend/types/WebtoonEpisode";

type WebtoonEpisodeDetailPageProps = {
  webtoon: WebtoonT
  episode: WebtoonEpisodeT
}

export function WebtoonEpisodeDetailPage({
  webtoon,
  episode
}: WebtoonEpisodeDetailPageProps) {

  return (
    <Suspense fallback={<Spinner />}>
      <Container>
        <EpisodeDetail episode={episode} webtoon={webtoon} />
      </Container>
    </Suspense>
  );
}
