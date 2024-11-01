"use client";

import { Container, Row, Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UpdateWebtoonPostForm } from "@/app/[locale]/webtoons/[webtoonId]/update/UpdateWebtoonPostForm";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { WebtoonEpisodeT } from "@/resources/webtoonEpisodes/webtoonEpisode.types";

export function UpdateWebtoonEpisodetPage({ episode }: {
  episode: WebtoonEpisodeT
}) {
  const router = useRouter();
  const path = usePathname();
  const t = useTranslations("detailedInfoPage");

  return (
    <Container className="text-white">
      <div className='mx-auto max-w-xl'>
        <Row>

          <Button variant='ghost' onClick={() => {router.push(
            `/webtoons/${path.split("/")[3]}/episodes/${path.split("/")[5]}`
          );}}>
            <ArrowLeftIcon width={32} height={32} />
          </Button>

          <Gap x={2} />
          <div>{t("editEpisode")}</div>
        </Row>

        <Gap y={4} />

        <UpdateWebtoonPostForm episode={episode} />
      </div>
    </Container>
  );
}
