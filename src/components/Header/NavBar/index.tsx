import { Row } from "@/ui/layouts";
import NavigationLink from "./NavigationLink";
import { UserTypeT } from "@/resources/users/user.types";
import { AdminLevel } from "@/utils/auth/base";
import { getTranslations } from "next-intl/server";
import { getUserInfo } from "@/utils/auth/server";

export type NavArrT = {
  name: string;
  path: string;
}[];

export async function NavBar() {
  const t = await getTranslations("inquiryMenu");
  const user = await getUserInfo().catch(() => undefined);
  const userType = user?.type;
  const adminLevel = user?.adminLevel || AdminLevel.None;

  if (!userType) {
    return null;
  }

  const nav: NavArrT = [
    {
      name: `${t("home")}`,
      path: "/",
    },
    {
      name: `${t("seeAll")}`,
      path: "/webtoons",
    },
    {
      name: `${t("market")}`,
      path: "/market",
    },
    {
      name: `${t("manageContents")}`,
      path: "/creator/bid-rounds",
    },
    {
      name: `${t("manageOffers")}`,
      path: "/creator/bid-requests",
    },
    {
      name: `${t("invoice")}`,
      path: "/creator/invoice",
    },
    {
      name: `${t("myInfo")}`,
      path: "/creator/my",
    },
    {
      name: `${t("offer")}`,
      path: "/buyer/bid-round-requests",
    },
    {
      name: `${t("invoice")}`,
      path: "/buyer/invoice",
    },
    {
      name: `${t("myInfo")}`,
      path: "/buyer/my",
    },
    {
      name: "관리",
      path: "/admin/dashboard",
    }
  ].filter(({ path }) => {
    // TODO: 메뉴 확정 후 더 우아하게 수정
    const role = path.split("/")[1];
    return !["buyer", "creator", "admin"].includes(role)
        || (role === "buyer" && userType === UserTypeT.Buyer)
        || (role === "creator" && userType === UserTypeT.Creator)
        || (role === "admin" && adminLevel > 0);
  });
  // TODO 해당사항 없을 때 마스킹 처리

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
