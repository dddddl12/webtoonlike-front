import { NavigationMenuContent } from "@/ui/shadcn/NavigationMenu";
import { NavArrT } from "../NavBar";
import Link from "next/link";
import { Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";

type NavProps = {
  nav: NavArrT
}


export function SubNavBar({ nav }:NavProps) {
  return (
    <NavigationMenuContent>
      {/* <Row className="w-screen xl:w-[1280px] flex bg-black/70 flex-row items-start justify-start">
        {nav.map((item) =>
          <ul key={item.name} className="w-[83px]">
            {item.subNav.map((cur) =>
              <Link key={cur.name} href={cur.path}>
                <li className="w-[83px] h-[46px] cursor-pointer flex items-center justify-center hover:text-red">
                  {cur.name}
                </li>
              </Link>
            )}
          </ul>
        )}
      </Row> */}
    </NavigationMenuContent>
  );
};
