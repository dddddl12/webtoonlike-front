"use client";

import { Row } from "@/ui/layouts";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/shadcn/NavigationMenu";
import { useTranslations } from "next-intl";
import NavigationLink from "./NavigationLink";
import { UserTypeT } from "@/resources/users/user.types";
import { useUser } from "@clerk/nextjs";
import { AdminLevel, ClerkUserMetadataSchema } from "@/utils/auth/base";

export type NavArrT = {
    name: string;
    path: string;
  }[];

export function NavBar() {
  const t = useTranslations("inquiryMenu");
  const clerkUser = useUser();
  const { data: userInfo } = ClerkUserMetadataSchema.safeParse(clerkUser.user?.publicMetadata);
  const userType = userInfo?.type;
  const adminLevel = userInfo?.adminLevel || AdminLevel.None;

  if (!userType) {
    return <></>;
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
    <Row className="sticky w-full h-[48px] bg-black">
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
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </Row>
  );
}
