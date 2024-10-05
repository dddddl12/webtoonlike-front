"use client";

import { IconDocs } from "@/components/svgs/IconDocs";
import { IconGrid } from "@/components/svgs/IconGrid";
import { IconSearch } from "@/components/svgs/IconSearch";
import { Row, Col, Gap } from "@/ui/layouts";
import { Input } from "@/ui/shadcn/Input";
import { Text } from "@/ui/texts";

export function MainSearch() {
  return (
    <Row
      className="w-[684px] h-[120px] absolute left-1/2 bottom-5 justify-around -translate-x-1/2 -translate-y-1/2 place-items-center bg-white rounded-[60px] p-[20px]"
    >
      <Col className="items-center justify-center w-[25%] h-full hover:bg-gray rounded-[60px] cursor-pointer">
        <Row>
          <IconGrid />
          <Gap x={3} />
          <Text className="text-black font-bold">장르선택</Text>
        </Row>
        <Text className="text-black">전체</Text>
      </Col>

      <Col className="items-center justify-center w-[25%] h-full hover:bg-gray rounded-[60px] cursor-pointer">
        <Row>
          <IconDocs />
          <Gap x={3} />
          <Text className="text-black font-bold">작품유형</Text>
        </Row>
        <Text className="text-black">전체</Text>
      </Col>

      <Row className="w-[50%] h-full items-center justify-around hover:bg-gray rounded-[60px]">
        <Input className="text-black bg-white border-none w-60" placeholder="작품명, 작가명을 검색해보세요" />
        <Row className="bg-red rounded-full p-[10px] cursor-pointer">
          <IconSearch fill="white" />
        </Row>
      </Row>
    </Row>
  );
}
