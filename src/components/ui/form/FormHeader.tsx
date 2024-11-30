import { Row } from "@/components/ui/common";
import { Button } from "@/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export function FormHeader({ title, goBackHref }: {
  title: string;
  goBackHref: string;
}) {
  return <Row className="items-center mb-14">
    <Button variant='ghost' asChild>
      <Link href={goBackHref}>
        <ArrowLeftIcon width={32} height={32} />
      </Link>
    </Button>
    <h2 className="font-bold text-2xl ml-2">{title}</h2>
  </Row>;
}