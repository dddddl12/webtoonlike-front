import { Row } from "@/ui/layouts";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/shadcn/NavigationMenu";
import { useTranslations } from "next-intl";
import NavigationLink from "./NavigationLink";
import { authCookieName, getUserInfo } from "@/utils/authedUser";
import { getCookieValue } from "@/utils/cookies";

export type NavArrT = {
    name: string;
    path: string;
  }[];

export function NavBar() {
  const token = getCookieValue(authCookieName);
  const user = getUserInfo(token);
  const t = useTranslations("inquiryMenu");
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
        || (role === "buyer" && user.type === "buyer")
        || (role === "creator" && user.type === "creator")
        || (role === "admin" && user.adminLevel > 0);
  });

  return (
    <Row className="w-full h-[48px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="p-0">
              {nav.map((item) => (
                <NavigationLink
                  href={item.path}
                  key={item.name}
                >
                  {item.name}
                </NavigationLink>
              ))}
              {/* <SubNavBar nav={nav} /> */}
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Row>
  );
}
