import React from "react";
import { Col, Container, Gap } from "@/ui/layouts";
import { CreatorUpdateProfileForm } from "./CreatorUpdateProfileForm";
import { Heading } from "@/ui/texts";
import { useTranslations } from "next-intl";

export function CreatorUpdateProfilePage(): JSX.Element {
  const t = useTranslations("myInfoPage");
  return (
    <Container>
      <Gap y={20} />
      <Col className="m-auto w-[500px]">
        <Heading className="font-bold text-[24pt]">{t("editProfile")}</Heading>

        <Gap y={10} />
        <CreatorUpdateProfileForm />
      </Col>
    </Container>
  );
}