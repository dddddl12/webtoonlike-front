import * as React from "react";

import { cn } from "@/shadcn/lib/utils";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { FieldName } from "@/shadcn/ui/form";
import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={value ?? ""}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

//여기서부터 커스텀
interface NumericInputProps<TFieldValues extends FieldValues>
  extends Omit<InputProps, "type" | "value"> {
  register: UseFormRegister<TFieldValues>;
  name: FieldName<TFieldValues, number>;
}

export function NumericInput<TFieldValues extends FieldValues>(
  { register, name, ...props }: NumericInputProps<TFieldValues>
) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const field = register(name, {
    setValueAs: (rawInput: string) => {
      const intValue = parseInt(rawInput);
      if (intValue >= 0) {
        setDisplayValue(intValue.toString());
        return intValue;
      } else if (!rawInput) {
        setDisplayValue("");
      }
    }
  });
  return <Input
    {...props}
    {...field}
    type="text"
    value={displayValue}
  />;
}
