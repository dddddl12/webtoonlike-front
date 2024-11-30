import { Button } from "@/shadcn/ui/button";
import { IconRightBrackets } from "@/components/svgs/IconRightBrackets";
import { Row } from "@/components/ui/common";
import { useTranslations } from "next-intl";

export default function SubmitButton({ disabled, isNew }: {
  disabled: boolean;
  isNew: boolean;
}) {
  const tGeneral = useTranslations("general");
  return <Row className="justify-end mt-14">
    <Button
      disabled={disabled}
      variant="mint"
    >
      {isNew
        ? `${tGeneral("submit")}`
        : `${tGeneral("edit")}`}
      <IconRightBrackets />
    </Button>
  </Row>;
}