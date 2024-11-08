import { Form } from "@/components/ui/shadcn/Form";
import { FieldValues, FormProviderProps } from "react-hook-form";
import { Button } from "@/components/ui/shadcn/Button";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Row } from "@/components/ui/layouts";
import style from "./style.module.css";

export function TemplatedForm<TFieldValues extends FieldValues, TContext = any, TTransformedValues extends FieldValues | undefined = undefined>(
  props: FormProviderProps<TFieldValues, TContext, TTransformedValues>
) {
  return <Form {...props}>
    <div className={style.formWrapper}>
      {props.children}
    </div>
  </Form>;
}

export function FormHeader({ title, goBackHref }: {
  title: string;
  goBackHref: string;
}) {
  return <Row className="items-center mb-14">
    <Button variant='ghost'>
      <Link href={goBackHref}>
        <ArrowLeftIcon width={32} height={32} />
      </Link>
    </Button>
    <h2 className="font-bold text-2xl ml-2">{title}</h2>
  </Row>;
}