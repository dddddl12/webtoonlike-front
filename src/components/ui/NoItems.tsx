import { Row } from "@/components/ui/common";
import { ReactNode } from "react";

export default function NoItems({ message, children }: {
  message: string;
  children?: ReactNode;
}) {
  // todo muted 색상 확인
  return <Row className="rounded-md bg-muted h-[84px] justify-center">
    <p>{message}</p>
    {children}
  </Row>;
}