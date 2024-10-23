import { WebtooonFeedList } from "./WebtoonFeedList";
import { Col, Container, Gap, Row } from "@/ui/layouts";
import { Heading } from "@/ui/texts";
import { getTranslations } from "next-intl/server";

export async function AllWebtoonPage() {
  const itemsPerPage = 10;
  const [
    { data: genres$ },
    { data: webtoons$, numData }
  ] = await Promise.all([
    GenreApi.list(),
    WebtoonApi.list({
      $numData: true,
      limit: itemsPerPage
    })
  ]);
  const TallSeries = await getTranslations("allSeries");

  return (
    <Container>
      <Col className="flex justify-center">
        <Gap y={20} />
        <Row className="w-[1200px]">
          <Heading className="text-white text-[32px] font-bold">
            {TallSeries("allSeries")}
          </Heading>
        </Row>
        <Gap y={10} />
        <WebtooonFeedList
          genres={genres$}
          initialWebtoonList={{
            items: webtoons$,
            numData: numData || 0
          }}
          itemsPerPage={itemsPerPage}
        />
        <Gap y={40} />
      </Col>
    </Container>
  );
}
