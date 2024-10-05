import React from "react";
import { Col, Container, Gap } from "@/ui/layouts";
import { BuyerUpdateProfileForm } from "./BuyerUpdateProfileForm";
import { Heading } from "@/ui/texts";
import { useTranslations } from "next-intl";

export function BuyerUpdateProfilePage(): JSX.Element {
  const t = useTranslations("editProfilePage");
  return (
    <Container>
      <Gap y={20} />
      <Col className="m-auto w-[500px]">
        <Heading className="font-bold text-[24pt]">{t("editProfile")}</Heading>

        <Gap y={10} />
        <BuyerUpdateProfileForm/>
      </Col>
    </Container>
  );
}