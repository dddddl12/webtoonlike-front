"use client";

import Link from "next/link";
import { Container, Row, Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { UpdateWebtoonForm } from "./UpdateWebtoonForm";
import type { WebtoonT } from "@/types";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

type UpdateWebtoonPageProps = {
  webtoon: WebtoonT;
}

export function UpdateWebtoonPage({ webtoon }: UpdateWebtoonPageProps) {
  const router = useRouter();
  const locale = useLocale();


  return (
    <Container className="max-w-[550px] text-white">
      <Row>
        <Button variant='ghost' onClick={() => {router.push(`/webtoons/${webtoon.id}`);}}>
          <ArrowLeftIcon width={32} height={32} />
        </Button>

        <Gap x={2}/>

        <h1 className='text-xl'>
          {locale === "en" ? "Edit Webtoon" : "작품 수정하기"}
        </h1>
      </Row>

      <Gap y={15}/>

      <UpdateWebtoonForm webtoon={webtoon}/>

    </Container>
  );
}
