import React, { Suspense } from "react";
import { Container } from "@/ui/layouts";
import { EpisodeDetail } from "./EpisodeDetail";
import { WebtoonT, WebtoonEpisodeT } from "@/types";
import Spinner from "@/components/Spinner";

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
