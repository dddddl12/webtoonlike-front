import { UserFormSchema, UserFormT } from "@/resources/users/dtos/user.dto";
import { SignUpStage, UserAccountFormT } from "@/resources/users/dtos/userAccount.dto";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Col, Row } from "@/components/ui/common";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { clsx } from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import AccountFormFooter from "@/components/forms/account/components/AccountFormFooter";
import Terms from "@/components/forms/account/components/Terms";

export default function UserProfileForm({ userAccountForm, setUserAccountForm, setSignUpStage }: {
  userAccountForm: Partial<UserAccountFormT>;
  setUserAccountForm: Dispatch<SetStateAction<Partial<UserAccountFormT>>>;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
}) {
  const t = useTranslations("setupForm");
  const tUserType = useTranslations("userType");
  const tCountries = useTranslations("countries");
  // todo
  const form = useForm<UserFormT>({
    defaultValues: userAccountForm,
    mode: "onChange",
    resolver: zodResolver(UserFormSchema)
  });

  // 필수 필드 체크
  const { formState: { isValid } } = form;

  return <Form {...form} schema={UserFormSchema}>
    <form
      onSubmit={form.handleSubmit((values) => {
        setUserAccountForm(prev => ({
          ...prev,
          ...values
        }));
        setSignUpStage(prevState => prevState + 1);
      })}
      className="flex flex-col gap-5"
    >
      <span>
        {t("selectedUserType", {
          userType: tUserType(userAccountForm.userType)
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
          <Terms/>
        </Col>
      </Col>

      <AccountFormFooter isValid={isValid} setSignUpStage={setSignUpStage}/>
    </form>
  </Form>;
}
