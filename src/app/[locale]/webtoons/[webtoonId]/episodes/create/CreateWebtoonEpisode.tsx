"use client";

import { useRouter } from "next/navigation";

type CreateWebtoonEpisodeProps = {
  webtoonId: number;
};

export function CreateWebtoonEpisode({ webtoonId }: CreateWebtoonEpisodeProps) {

  const router = useRouter();


  return (
    <></>
    // <WebtoonEpisodeForm
    //   webtoonId={webtoonId}
    //   onSubmit={handleSubmit}
    // />
  );
}
