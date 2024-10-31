import { Col, Container, Gap } from "@/ui/layouts";
import { InfoSection } from "./InfoSection";
import { LikeWebtoonList } from "@/components/LikeWebtoonList";

export function CreatorMyPage() {
  return (
    <Container className="bg-[#121212]">
      <InfoSection />
      <Gap y={20} />
      <Col className="items-center max-w-[1200px] m-auto">
        <LikeWebtoonList />
      </Col>
      <Gap y={50} />
    </Container>
  );
}
