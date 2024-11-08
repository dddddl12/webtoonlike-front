import { Col } from "@/components/ui/layouts";
import { Button } from "@/components/ui/shadcn/Button";
import { Heading, Text } from "@/components/ui/texts";
import { headers } from "next/headers";

export default async function NotFound() {
  const headersList = await headers();
  const domain = headersList.get("host");
  return (
    <Col>
      <Heading>404 ERROR</Heading>
      <Text>원하시는 페이지를 찾을 수 없습니다.</Text>
      <Text>
        찾으려는 페이지의 주소가 잘못 입력되었거나,
        <br />
        주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
      </Text>
      <Button variant="outline">홈으로 돌아가기</Button>
    </Col>
  );
}