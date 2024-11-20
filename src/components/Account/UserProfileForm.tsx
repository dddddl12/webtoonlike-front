import { SignUpStage, UserExtendedFormT, UserFormSchema, UserFormT } from "@/resources/users/user.types";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Col, Row } from "@/shadcn/ui/layouts";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Checkbox } from "@/shadcn/ui/checkbox";
import TermsOfUse from "@/components/Account/TermsOfUse";
import { formResolver } from "@/utils/forms";
import { clsx } from "clsx";
import { AccountFormFooter } from "@/components/Account/common";
import { zodResolver } from "@hookform/resolvers/zod";

export default function UserProfileForm({ userExtendedForm, setUserExtendedForm, setSignUpStage }: {
  userExtendedForm: Partial<UserExtendedFormT>;
  setUserExtendedForm: Dispatch<SetStateAction<Partial<UserExtendedFormT>>>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  const t = useTranslations("setupForm");
  const tUserType = useTranslations("userType");
  const tCountries = useTranslations("countries");
  // todo
  const form = useForm<UserFormT>({
    defaultValues: userExtendedForm,
    mode: "onChange",
    resolver: zodResolver(UserFormSchema)
  });

  // 필수 필드 체크
  const { formState: { isValid } } = form;

  return <Form {...form}>
    <form
      onSubmit={form.handleSubmit((values) => {
        setUserExtendedForm(prev => ({
          ...prev,
          ...values
        }));
        setSignUpStage(prevState => prevState + 1);
      })}
      className="flex flex-col gap-5"
    >
      <span>
        {t("selectedUserType", {
          userType: tUserType(userExtendedForm.userType)
        })}
      </span>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="text"
                autoComplete="name"
                placeholder={t("insertName")}
              />
            </FormControl>
          </FormItem>
        )}
      />


      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="tel"
                autoComplete="mobile tel"
                placeholder={t("insertPhone")}
              />
            </FormControl>
          </FormItem>
        )}
      />


      <hr className="my-5"/>


      <Row className="justify-between gap-2">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Select defaultValue={field?.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("insertCountry")}/>
                  </SelectTrigger>
                  <SelectContent>
                    {UserFormSchema.shape.country.options
                      .map((value) => (
                        <SelectItem key={value} value={value}>
                          {tCountries(value, { plural: false })}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  autoComplete="postal-code"
                  placeholder={t("insertPostalCode")}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Row>

      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="text"
                autoComplete="address-level1"
                placeholder={t("insertAddress1")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="addressLine2"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                type="text"
                autoComplete="address-level2"
                placeholder={t("insertAddress2")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <hr className="my-5"/>

      <Col className="border rounded-sm">

        <FormField
          control={form.control}
          name="agreed"
          render={({ field }) => (
            <FormItem className="flex items-center p-3 border-b">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="ml-3">
                {t("doYouAgree")}
              </FormLabel>
            </FormItem>
          )}
        />

        <Col className={clsx("p-3 h-[233px] overflow-y-scroll bg-gray-light text-sm",
          "[&_h1]:font-bold [&_h1]:text-base")}>
          <TermsOfUse/>
        </Col>
      </Col>

      <AccountFormFooter isValid={isValid} setSignUpStage={setSignUpStage} />
    </form>
  </Form>;
}
