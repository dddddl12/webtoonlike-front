"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  ControllerProps,
  FieldPath, FieldPathValue,
  FieldValues,
  FormProvider,
  useFormContext, Control,
} from "react-hook-form";

import { cn } from "@/shadcn/lib/utils";
import { Label } from "@/shadcn/ui/label";
import { Row } from "@/shadcn/ui/layouts";
import { Button } from "@/shadcn/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn(className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};


// 여기서부터 커스텀
interface FieldSetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {}

export const FieldSet = React.forwardRef<HTMLFieldSetElement, FieldSetProps>(
  ({ className, ...props }, ref) => {
    return (
      <fieldset
        className={cn(
          "w-full mt-6",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
FieldSet.displayName = "FieldSet";

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

export type FieldName<TFieldValues extends FieldValues, AllowedFieldType> = {
  [K in FieldPath<TFieldValues>]: FieldPathValue<TFieldValues, K> extends AllowedFieldType | undefined ? K : never;
}[FieldPath<TFieldValues>];

export function BooleanFormField<TFieldValues extends FieldValues>({ control, name, items, className }: {
  control: Control<TFieldValues>;
  name: FieldName<TFieldValues, boolean>;
  items: {
    value: boolean;
    label: string;
  }[];
  className?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormControl>
            <RadioGroup
              {...field}
              value={field.value?.toString() || ""}
              className="flex flex-wrap gap-3"
              onValueChange={(value) => {
                field.onChange(JSON.parse(value));
              }}
              onChange={undefined}
            >
              {items.map((item, index) => (
                <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
                  <FormControl>
                    <RadioGroupItem
                      className="border border-white"
                      value={item.value.toString()}
                    />
                  </FormControl>
                  <FormLabel>
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

// export function NumberFormField<TFieldValues extends FieldValues>({ control, name }: {
//   control: Control<TFieldValues>;
//   name: FieldName<TFieldValues, number>;
// }) {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className={className}>
//           <FormControl>
//             <RadioGroup
//               {...field}
//               value={field.value?.toString() || ""}
//               className="flex flex-wrap gap-3"
//               onValueChange={(value) => {
//                 field.onChange(JSON.parse(value));
//               }}
//               onChange={undefined}
//             >
//               {items.map((item, index) => (
//                 <FormItem key={index} className="space-x-1 space-y-0 flex items-center">
//                   <FormControl>
//                     <RadioGroupItem
//                       className="border border-white"
//                       value={item.value.toString()}
//                     />
//                   </FormControl>
//                   <FormLabel>
//                     {item.label}
//                   </FormLabel>
//                 </FormItem>
//               ))}
//             </RadioGroup>
//           </FormControl>
//         </FormItem>
//       )}
//     />
//   );
// }
