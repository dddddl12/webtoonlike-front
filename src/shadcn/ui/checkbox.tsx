"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/shadcn/lib/utils";

export const CheckboxGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("flex flex-wrap gap-3", className)}
    {...props}
  />
);
CheckboxGroup.displayName = "CheckboxGroup";

export const Checkbox = ({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root
    className={cn(
      "peer h-[1.125rem] w-[1.125rem] shrink-0 rounded-sm border-2 border-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-mint data-[state=checked]:border-none data-[state=checked]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <svg width="12" height="10" viewBox="0 0 12 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.59 0L12 1.42L4 9.42L0 5.43L1.42 4.02L4 6.59L10.59 0Z"/>
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
