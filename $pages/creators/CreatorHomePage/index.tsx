import { Button } from "@/ui/shadcn/Button";
import { Container, Row, Gap } from "@/ui/layouts";
import { MyWebtooonList } from "./MyWebtoonList";
import { useRouter } from "@/i18n/routing";

export function CreatorHomePage(): JSX.Element {
  const user = getServerUserInfo();
  const router = useRouter();
  return (
    <Container>
      <Row>
        <h1 className='bold text-2xl'>Webtoon</h1>

        <Gap x={4} />

        <Button variant='outline' onClick={() => {router.push("/webtoons/create");}}>create</Button>
      </Row>
      {/* webtoon section */}

      <Gap y={4} />

      <MyWebtooonList userId={user.id} />

    </Container>
  );
}
