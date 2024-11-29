import { Col } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { Heading1 } from "@/components/ui/common";

// TODO
export default async function NotFound() {
  return (
    <Col>
      <Heading1>404 ERROR</Heading1>
      <p>원하시는 페이지를 찾을 수 없습니다.</p>
      <p>
        찾으려는 페이지의 주소가 잘못 입력되었거나,
        <br />
        주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
      </p>
      <Button variant="outline">홈으로 돌아가기</Button>
    </Col>
  );
}