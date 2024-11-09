import { cn } from "@/shadcn/lib/utils";

interface TextProps extends React.HTMLProps<HTMLParagraphElement> {}

export function Text({ className, ...props }: TextProps) {
  return (
    <p
      className={cn("text-base", className)}
      {...props}
    />
  );
}

interface HeadingProps extends React.HTMLProps<HTMLHeadingElement> {}

export function Heading({ className, ...props }: HeadingProps) {
  return (
    <h1
      className={cn("font-bold text-3xl mb-10 flex", className)}
      {...props}
    />
  );
}

export function Heading2({ className, ...props }: HeadingProps) {
  return (
    <h2
      className={cn("font-bold text-2xl mb-10 flex", className)}
      {...props}
    />
  );
}