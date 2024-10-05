import { Container, Gap } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { BuyerBidRoundList } from "./BuyerBidRoundList";

export function BuyerBidRoundRequestListPage() {
  return (
    <Container>
      <Gap y={20} />
      <BuyerBidRoundList />
      <Gap y={80} />
    </Container>
  );
}