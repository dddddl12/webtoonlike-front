"use client";

import { Col, Gap, Row } from "@/shadcn/ui/layouts";
import { Text } from "@/shadcn/ui/texts";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

export function Footer() {
  const router = useRouter();
  const t = useTranslations("footer");

  const COMPANY_INFO = [
    { name: `${t("registrationNumber")} 760-81-00950` },
    { name: `${t("mailSalesRegistrationNumber")} 2022-제주동홍-70` },
    { name: `${t("address")} ${t("addressLine")}` },
  ];
  return (
    <section className="bg-footer px-[60px] py-[40px] flex justify-center">
      <Row className="w-[1280px]">
        <Col className="w-[40%]">
          <Image
            src="/img/KIPstock_logo.png"
            alt="logo"
            width={150}
            height={17}
          />
          <Gap y={4} />
          <Text className="text-gray-text font-bold">
            {t("kenazCoLtd")}
          </Text>
          <Gap y={1} />
          <Text className="text-gray-text text-lg font-bold">{t("CEOname")}</Text>
          <Gap y={5} />
        </Col>

        <Col className="w-[60%]">
          <Row>

            <Text className="text-gray-text text-sm cursor-pointer" onClick={() => {router.push("/terms_of_use");}}>{t("termsAndConditions")}</Text>
            <Gap x={1} />
            <Text className="text-gray-text text-sm">|</Text>
            <Gap x={1} />
            <Text className="text-gray-text text-sm cursor-pointer" onClick={() => {router.push("/privacy_policy");}}>{t("privacyPolicy")}</Text>
            <Gap x={1} />
            <Text className="text-gray-text text-sm">|</Text>
            <Gap x={1} />
            <Text className="text-gray-text text-sm">{t("customerCenter")} 070-4295-7719</Text>

          </Row>

          <Gap y={5} />

          <Text className="text-gray-text text-sm">
            {t("description")}
          </Text>

          <Gap y={5} />

          <Row>
            {COMPANY_INFO.map((info, idx) => (
              <Fragment key={info.name}>
                <Text className="text-gray-text text-sm" key={info.name}>
                  {info.name}
                </Text>
                {idx + 1 < COMPANY_INFO.length ? (
                  <>
                    <Gap x={1} />
                    <Text className="text-gray-text text-sm">|</Text>
                    <Gap x={1} />
                  </>
                ) : null}
              </Fragment>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
}
