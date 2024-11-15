import { Badge, BadgeProps } from "@/shadcn/ui/badge";

export default function StatusBadge({ content, ...rest }: BadgeProps & {
  content: string;
}) {
  return <Badge {...rest} className="w-[100px] h-[28px] justify-center font-bold text-sm">
    {content}
  </Badge>;
}