"use client";

import { WebtoonEpisodeDetailsT } from "@/resources/webtoonEpisodes/webtoonEpisode.service";
import { Col, Row } from "@/shadcn/ui/layouts";
import { buildImgUrl } from "@/utils/media";
import axios from "axios";
import { displayName } from "@/utils/displayName";
import { useLocale } from "next-intl";

export default function DownloadEpisodeImage({ episode }: {
  episode: WebtoonEpisodeDetailsT;
}) {
  const { webtoon } = episode;
  const locale = useLocale();
  if (episode.imagePaths.length === 0) {
    return null;
  }
  return <Col className="w-full rounded-sm bg-gray-darker px-5 py-2">
    {episode.imagePaths.map((path, idx) => {
      const filename = `${displayName(
        locale, webtoon.title, webtoon.title_en)}_${episode.episodeNo}_${idx + 1}.jpeg`;
      return <Row key={idx} className="my-1 text-[10px] gap-1">
        <span>{filename}</span>
        <span className="bg-mint rounded-sm px-2 cursor-pointer"
          onClick={() => downloadImage(path, filename)}>다운로드</span>
      </Row>;
    })}
  </Col>;
}

// todo 파일 링크에 대한 보안 검사 없음
// todo XSS & sql injection 고려
function downloadImage(path: string, filename: string) {
  axios.get(buildImgUrl(path), {
    responseType: "blob"
  })
    .then(response => response.data)
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    });
}

const forceDownload = (blobUrl: string, filename: string) => {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};