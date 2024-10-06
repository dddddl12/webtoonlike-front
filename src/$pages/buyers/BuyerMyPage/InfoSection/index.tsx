"use client";

import { useMe } from "@/states/UserState";
import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Text } from "@/ui/texts";
import { buildImgUrl } from "@/utils/media";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import * as UserApi from "@/apis/users";
import { useAlertDialog } from "@/hooks/ConfirmDialog";
import { useRouter } from "@/i18n/routing";

export function InfoSection() {
  const me = useMe();
  const t = useTranslations("myInfoPage");
  const { showAlertDialog } = useAlertDialog();
  const router = useRouter();

  async function handleClickDeleteMe(): Promise<void> {
    const isOk = await showAlertDialog({
      title: t("withdrawal"),
      body: t("withdrawalDesc"),
      useOk: true,
    });
    if (!isOk) {
      return;
    }
    try {
      await UserApi.deleteMe();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Gap y="80px" />
      <Col className="items-center max-w-[1200px] m-auto ">
        <Col className="w-full justify-center items-center sm:flex-row">
          <div className="w-[160px] h-[160px] overflow-hidden relative rounded-full">
            <Image
              src={me?.buyer?.companyInfo.thumbPath ? buildImgUrl(null, me?.buyer?.companyInfo.thumbPath, { size: "md" } ) : "/img/mock_profile_image.png"}
              alt="profile_image"
              style={{ objectFit: "cover" }}
              fill
            />
          </div>
          <Gap x={15} />
          <Gap y={5} />
          <Col className="items-center justify-center w-full sm:items-start">
            {me?.buyer ? (
              <Text className="text-white font-bold text-[26pt]">
                {me.buyer.name}
              </Text>
            ) : (
              <Text className="font-bold text-[26pt]">
                (알 수 없음)
              </Text>
            )}
            <Gap y={5} />
            <Col className="w-full justify-between sm:flex-row">
              <Col className="sm:flex-row">
                <Button className="rounded-sm bg-gray-darker text-white hover:bg-gray-darker" onClick={() => {router.push("/buyer/my/update");}}>
                  {t("editProfile")}
                </Button>
                <Gap x={5} />
                <Gap y={2} />

              </Col>
              <Row className="w-full justify-end">
                <Button
                  className="bg-red text-white rounded-sm hover:bg-gray-darker"
                  onClick={handleClickDeleteMe}
                >
                  {t("withdrawal")}
                </Button>
              </Row>
              <Gap y={2} />
            </Col>
          </Col>
        </Col>
      </Col>
      <Gap y="80px" />
    </>
  );
}
