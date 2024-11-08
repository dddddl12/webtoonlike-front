import { UserFormSchema, UserFormT, UserTypeT } from "@/resources/users/user.types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { useRouter } from "@/i18n/routing";
import Spinner from "@/components/Spinner";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/shadcn/Form";
import { createUser } from "@/resources/users/user.service";
import { Col, Gap, Row } from "@/components/ui/layouts";
import { Input } from "@/components/ui/shadcn/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/Select";
import { Text } from "@/components/ui/texts";
import { Checkbox } from "@/components/ui/shadcn/CheckBox";
import { Button } from "@/components/ui/shadcn/Button";
import TermsOfUse from "@/components/Account/BasicUserInfo/TermsOfUse";

// TODO 이름도 필드에 포함
export default function ProfileForm({ userType, setUserType }: {
  userType: UserTypeT
  setUserType: Dispatch<SetStateAction<UserTypeT | undefined>>;
}) {
  const t = useTranslations("setupForm");
  const tGeneral = useTranslations("general");
  const tCountries = useTranslations("countries");
  const form = useForm<UserFormT>({
    defaultValues: {
      phone: "",
      userType,
      postcode: "",
      addressLine1: "",
      addressLine2: ""
    },
  });

  // 필수 필드 체크
  const fieldValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  useEffect(() => {
    const { success } = UserFormSchema.safeParse(fieldValues);
    setAllRequiredFilled(success);
  }, [fieldValues]);

  // 제출 이후 동작
  const router = useRouter();
  const onSubmit = async (userForm: UserFormT) => {
    setSubmissionInProgress(true);
    await createUser(userForm);
  };

  // 스피너
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner />;
  }

  return <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <span className="text-black">
        {t("selectedUserType", {
          userType: userType === UserTypeT.Creator
            ? t("selectedUserTypeCreator")
            : t("selectedUserTypeBuyer")
        })}
      </span>
      <Gap y={10}/>

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="border-gray"
                type="tel"
                placeholder={t("insertPhone")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Gap y={10}/>

      <hr className="border-gray"/>

      <Gap y={10}/>

      <Row className="justify-between gap-2">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm">
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
                  className="border-gray"
                  type="text"
                  inputMode="numeric"
                  placeholder={t("insertPostalCode")}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Row>

      <Gap y={5}/>

      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="border-gray"
                type="text"
                placeholder={t("insertAddress1")}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Gap y={5}/>

      <FormField
        control={form.control}
        name="addressLine2"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="border-gray"
                type="text"
                placeholder={t("insertAddress2")}
              />
            </FormControl>
          </FormItem>
        )}
      />


      <Gap y={10}/>

      <hr className="border-gray"/>

      <Gap y={10}/>

      <Row className="px-4 py-2 text-black-texts text-[11pt] border border-gray rounded-t-sm">
        {t("termsAndConditions")}
        <Gap x={1}/>
        <span className="text-red">{t("required")}</span>
      </Row>

      <Col className="h-[350px] overflow-y-scroll border border-gray rounded-b-sm">
        <Row className="sticky top-0 p-3 justify-center bg-gray-light/90">
          <Text className="text-sm text-black-texts">
            {t("doYouAgree")}
          </Text>
          <Gap x={1}/>
          <FormField
            control={form.control}
            name="agreed"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Checkbox
                    className="drop-shadow-lg"
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

        </Row>
        <Col className="p-3">
          <TermsOfUse/>
        </Col>
        <Gap y={5}/>
      </Col>

      <Gap y={10}/>

      <Row className="w-full justify-between">
        <Button
          className="w-[49%] bg-black-texts text-white hover:text-black"
          onClick={() => setUserType(undefined)}
        >
          {tGeneral("goBack")}
        </Button>
        <Input
          type="submit"
          className="w-[49%] bg-black-texts text-white hover:text-black"
          disabled={!allRequiredFilled}
          value={tGeneral("goNext")}
        />
      </Row>
    </form>
  </Form>;
}