import { Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";

export function ErrorComponent() {
  return (
    <Row className="w-full justify-center items-center p-5 rounded-sm bg-gray-darker">
      <Text className="text-gray">알 수 없는 오류가 발생했습니다.</Text>
    </Row>
  );
}
