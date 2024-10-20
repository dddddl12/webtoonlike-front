import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Col, Gap } from "@/ui/layouts";
import { KenazLogo } from "@/components/svgs/KenazLogo";
import { Heading } from "@/ui/texts";

function SignUpComplete({ children }: { children: ReactNode }) {
  const t = useTranslations("setupPage");

  return <Col className="bg-white min-h-[100vh] overflow-y-scroll items-center justify-start">
    <Gap y={40} />
    <Col className="w-[400px]">
      <KenazLogo className="fill-black" />
      <Gap y={10} />
      <Heading className="text-black font-bold text-[20pt]">
        {t("setupAccount")}
      </Heading>
      {children}
    </Col>
  </Col>;
}

