"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { useAdmin, useMe } from "@/states/UserState";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/shadcn/NavigationMenu";
import { useLocale, useTranslations } from "next-intl";
import NavigationLink from "./NavigationLink";
import { useSnackbar } from "notistack";
import { useAuth } from "@clerk/nextjs";

export type NavArrT = [
  {
    name: string;
    path: string;
  }
];

export function NavBar() {
  const t = useTranslations("inquiryMenu");
  const NAV_ARR = {
    guest: [
      {
        name: `${t("home")}`,
        path: "/",
      },
      {
        name: `${t("market")}`,
        path: "/sign-in",
      },
      {
        name: `${t("myInfo")}`,
        path: "/sign-in",
      },
    ],
    creator: [
      {
        name: `${t("home")}`,
        path: "/",
      },
      {
        name: `${t("seeAll")}`,
        path: "/webtoons",
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
    ],
    buyer: [
      {
        name: `${t("home")}`,
        path: "/",
      },
      {
        name: `${t("seeAll")}`,
        path: "/webtoons",
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
    ],
  };

  const ADMIN_TAB = {
    name: "관리",
    path: "/admin/dashboard",
  };

  const pathName = usePathname();
  const me = useMe();
  const admin = useAdmin();
  const router = useRouter();
  const locale = useLocale();
  const { getToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [nav, setNav] = useState<NavArrT>([
    {
      name: "",
      path: "",
    },
  ]);

  const authApi = async (getToken: any) => {
    const token = await getToken();
    return { token };
  };

  useEffect(() => {
    const fetchTokenAndUser = async () => {
      const { token } = await authApi(getToken);
      if (!token) {
        if (
          pathName.includes("/sign-in")
          || pathName.includes("/sign-up")
          || pathName === "/ko"
          || pathName === "/en"
        ) {
          return;
        }
        enqueueSnackbar("로그인이 필요한 페이지입니다.", { variant: "error" });
        router.replace("/sign-in");
      }
    };
    fetchTokenAndUser();
  }, [pathName]);

  useEffect(() => {
    if (!me?.userType) {
      setNav(NAV_ARR["guest"] as NavArrT);
    } else {
      if (admin) {
        if (NAV_ARR[me?.userType].find((item) => item.name === "관리")) {
          setNav(NAV_ARR[me?.userType] as NavArrT);
        } else {
          NAV_ARR[me?.userType] = [...NAV_ARR[me?.userType], ADMIN_TAB];
          setNav(NAV_ARR[me?.userType] as NavArrT);
        }
      } else {
        setNav(NAV_ARR[me?.userType] as NavArrT);
      }
    }
  }, [me, admin]);

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
                  className={`${
                    pathName === `/ko${item.path}`
                    || pathName === `/en${item.path}`
                    && pathName !== "/sign-in"
                      ? "text-red border-red border-b-[4px]"
                      : pathName.includes("/admin") && item.name === "관리"
                        ? "text-mint border-mint border-b-[4px]"
                        : "text-white border-none"
                  }
                    w-[100px] h-[46px] text-[18px] flex items-center justify-center font-bold  border-b-[4px] hover:border-red hover:text-red`}
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
