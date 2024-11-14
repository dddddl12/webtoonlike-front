import Image from "next/image";

export default function Logo({ lightTheme }: {
  lightTheme?: boolean;
}) {
  return <Image
    src={lightTheme ? "/img/logos/KIPstock_logo_light.png" : "/img/logos/KIPstock_logo_dark.png"}
    alt="logo"
    width={150}
    height={17}
  />;
}