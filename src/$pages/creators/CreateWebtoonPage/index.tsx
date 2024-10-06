"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Container, Row, Gap } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { CreateWebtoonForm } from "./CreateWebtoonForm";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";


export function CreateWebtoonPage() {
  const router = useRouter();
  const t = useTranslations("addSeries");
  return (
    <Container className="max-w-[550px] text-white">
      <Gap y={20} />
      <Row>
        <Button variant='ghost' onClick={() => {router.push("/creator/bid-rounds");}}>
          <ArrowLeftIcon width={32} height={32} />
        </Button>
        <Gap x={2}/>
        <h1 className='text-xl'>{t("addSeries")}</h1>
      </Row >

      <Gap y={15} />

      <CreateWebtoonForm />
    </Container>
  );
}
