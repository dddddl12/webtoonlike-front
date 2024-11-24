import { Row } from "@/components/ui/common";
import NavigationLink from "./NavigationLink";
import { UserTypeT } from "@/resources/users/dtos/user.dto";
import { getTranslations } from "next-intl/server";
import { AdminLevel } from "@/resources/tokens/token.types";
import { getTokenInfo } from "@/resources/tokens/token.service";

export type NavArrT = {
  name: string;
  path: string;
  isVisible: boolean;
}[];

export async function NavBar() {
  const t = await getTranslations("inquiryMenu");
  const tokenInfo = await getTokenInfo()
    .catch(() => undefined);
  const userType = tokenInfo?.metadata.type;
  const adminLevel = tokenInfo?.metadata.adminLevel || AdminLevel.None;

  if (!userType) {
    return null;
  }

  const nav: NavArrT = [
    {
      name: `${t("home")}`,
      path: "/",
      isVisible: true
    },
    {
      name: `${t("seeAll")}`,
      path: "/webtoons",
      isVisible: userType === UserTypeT.Buyer
    },
    {
      name: `${t("manageContents")}`,
      path: "/webtoons",
      isVisible: userType === UserTypeT.Creator
    },
    {
      name: `${t("manageOffers")}`,
      path: "/offers",
      isVisible: true
    },
    {
      name: `${t("invoice")}`,
      path: "/invoices",
      isVisible: true
    },
    {
      name: `${t("myInfo")}`,
      path: "/account",
      isVisible: true
    },
    {
      name: "관리",
      path: "/admin/dashboard",
      isVisible: adminLevel >= AdminLevel.Admin
    }
  ].filter((item) => item.isVisible);
  // TODO 해당사항 없을 때 마스킹 처리
    // TODO: 메뉴 확정 후 더 우아하게 수정

  return (
    <Row className="w-full max-w-screen-xl h-[60px]">
      {nav.map((item) => (
        <NavigationLink
          href={item.path}
          key={item.name}
        >
          {item.name}
        </NavigationLink>
      ))}
    </Row>
  );
}
