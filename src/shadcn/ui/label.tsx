"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shadcn/lib/utils";

const labelVariants = cva(
  "leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", {
    variants: {
      variant: {
        mainField: "block font-semibold text-base mb-2",
        selectItem: "text-sm"
      }
    },
    defaultVariants: {
      variant: "mainField",
    }
  }
);

const Label = ({ className, variant, ...props }: React.ComponentProps<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>) => (
  <LabelPrimitive.Root
    className={cn(labelVariants( { variant } ), className)}
    {...props}
  />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
