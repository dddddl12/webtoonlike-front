import { Row } from "@/ui/layouts";
import { IconTimer } from "../svgs/IconTimer";
import { Text } from "@/ui/texts";
import { IconPerson } from "../svgs/IconPerson";
import { useTranslations } from "next-intl";

type PropT = {
  time: string
  headCount: number
}

export function LeftTimeInfo({ time, headCount }: PropT ) {
  const ThomeMain = useTranslations("homeMain");
  return (
    <Row className="bg-gray justify-around w-[110px] h-[40px] px-[12px] py-p[8px] rounded-[20px]">
      {/* <IconTimer fill="#808080"/>
      <Text className="text-[12px] text-black">{time}</Text>
      <Text className="text-[18px] text-gray-shade">|</Text> */}
      <IconPerson fill="#808080"/>
      <Text className="text-[12px] text-black">{ headCount }{ThomeMain("numberOfOffers")}</Text>
    </Row>
  );
}
