"use client";

import { Button } from "@/ui/shadcn/Button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Container, Row, Gap } from "@/ui/layouts";
import { CreateWebtoonEpisodeForm } from "./CreateWebtoonEpisodeForm";
import { useRouter } from "next/navigation";

type CreateWebtoonEpisodePageProps = {
  webtoonId: idT
}

export function CreateWebtoonEpisodePage({ webtoonId }: CreateWebtoonEpisodePageProps) {
  const router = useRouter();
  return (
    <Container className="text-white max-w-[550px]">
      <Gap y={20} />
      <Row>
        <Button variant='ghost' onClick={() => {router.push(`/webtoons/${webtoonId}`);}}>
          <ArrowLeftIcon width={32} height={32} />
        </Button>
        <Gap x={2} />
        <div>회차 추가하기</div>
      </Row>

      <Gap y={15}/>

      <CreateWebtoonEpisodeForm webtoonId={webtoonId} />
    </Container>
  );
}
