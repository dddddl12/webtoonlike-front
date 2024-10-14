import { IconExclamation } from "@/components/svgs/IconExclamation";
import { Col, Gap, Row } from "@/ui/layouts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/ui/shadcn/Accordion";
import { Input } from "@/ui/shadcn/Input";
import { Label } from "@/ui/shadcn/Label";
import { RadioGroupItem } from "@/ui/shadcn/RadioGroup";
import { Text } from "@/ui/texts";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { ChevronDownIcon } from "lucide-react";
import { Fragment } from "react";
import type { WebtoonT } from "@backend/types/Webtoon";

type CreatorWebtoonDataProps = {
  webtoon: WebtoonT;
};

export function CreatorWebtoonData({ webtoon }: CreatorWebtoonDataProps) {
  return (
    <Fragment>
      <Gap y={10} />
      <hr className="border-gray-shade"/>
      <Gap y={10} />
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger><p className='text-2xl font-bold'>작품 상세정보</p><ChevronDownIcon /></AccordionTrigger>
          <AccordionContent>
            <Col className="p-5">
              <Row>
                <Text className="text-white text-[14pt] font-bold">작품 정보</Text>
                <Gap x={3} />
                <IconExclamation className="fill-white" />
              </Row>
              <Col className="p-5">
                <Text className="text-white">작품 유형</Text>
                <Gap y={2} />
                <RadioGroup disabled value={webtoon.bidRounds && `${webtoon.bidRounds[0]?.isBrandNew}`}>
                  <Row>
                    <RadioGroupItem value="true" className="border-white" />
                    <Label>신작</Label>
                    <Gap x={2} />
                    <RadioGroupItem value="false" className="border-white" />
                    <Label>구작</Label>
                  </Row>
                </RadioGroup>
                <Gap y={10} />
                <Text className="text-white">타 플랫폼 연재 여부</Text>
                <Gap y={2} />
                <RadioGroup disabled value={webtoon.bidRounds && `${webtoon.bidRounds[0]?.isSecondary ? webtoon.bidRounds[0]?.isSecondary : "false"}`}>
                  <Row>
                    <RadioGroupItem value="true" className="border-white" />
                    <Label>예</Label>
                    <Gap x={2} />
                    <RadioGroupItem value="false" className="border-white" />
                    <Label>아니오</Label>
                  </Row>
                </RadioGroup>
                <Gap y={10} />
                <Text className="text-white">연재 회차 정보</Text>
                <Gap y={2} />
                <Row><Input placeholder="_" value={webtoon.bidRounds && webtoon.bidRounds[0]?.numEpisode ? webtoon.bidRounds[0]?.numEpisode : 0} className="bg-gray-light w-[30px] p-0 text-center placeholder:text-black text-black" /><Gap x={2} />회 완결</Row>
                <Gap y={2} />
              </Col>
            </Col>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Fragment>
  );
}
