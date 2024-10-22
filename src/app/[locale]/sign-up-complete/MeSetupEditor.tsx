"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { useSnackbar } from "@/hooks/Snackbar";
import { Col, Gap, Row } from "@/ui/layouts";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";
import { Text } from "@/ui/texts";
import { Checkbox } from "@/ui/shadcn/CheckBox";
// import { nationConverterToKr } from "@/utils/nationConverter";
import { useLocale, useTranslations } from "next-intl";
import TermsOfUseKo from "@/common/TermsOfUseKo";
import TermsOfUseEn from "@/common/TermsOfUseEn";
import { UserFormT, UserTypeT } from "@/resources/users/user.types";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/ui/shadcn/Form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/ui/shadcn/Select";
import { createUser } from "@/resources/users/user.service";
import { useUser } from "@clerk/nextjs";
import { router } from "next/client";
import { useRouter } from "@/i18n/routing";
import Spinner from "@/components/Spinner";

const NATION_DATA = [
  { label: "대한민국", value: "ko" },
  { label: "미국", value: "en" },
  { label: "중국", value: "zhCN" },
  { label: "대만", value: "zhTW" },
  { label: "일본", value: "ja" },
  { label: "프랑스", value: "fr" },
  { label: "스페인", value: "es" },
  { label: "베트남", value: "vi" },
  { label: "말레이시아", value: "ms" },
  { label: "태국", value: "th" },
  { label: "기타", value: "all" },
];

export function MeSetupEditor() {
  const { enqueueSnackbar } = useSnackbar();

  const [userType, setUserType] = useState<UserTypeT | undefined>();

  // enqueueSnackbar("user successfully created", { variant: "success" });

  return userType ?
    <ProfileForm userType={userType} setUserType={setUserType} /> :
    <UserTypeSelector setUserType={setUserType} />;
}

function UserTypeSelector({ setUserType }: {
  setUserType: Dispatch<SetStateAction<UserTypeT | undefined>>;
}) {
  const t = useTranslations("setupPage");

  return <>
    <span className="text-black">{t("selectMembershipType")}</span>
    <Gap y={20} />

    <Row className="justify-evenly">
      <Col className="justify-center items-center">
        <IconSignupCreator className="fill-black" />
        <Gap y={4} />
        <span className="text-black">{t("membershipCopyrightHolder")}</span>
        <Gap y={4} />
        <Button
          onClick={() => setUserType(UserTypeT.Creator)}
          className="w-[160px] bg-black-texts text-white hover:bg-mint"
        >
          {t("createAccount")}
        </Button>
      </Col>

      <div className="border border-gray h-[180px]" />

      <Col className="justify-center items-center">
        <IconSignupBuyer className="fill-black" />
        <Gap y={4} />
        <span className="text-black">{t("membershipBuyers")}</span>
        <Gap y={4} />
        <Button
          onClick={() => setUserType(UserTypeT.Buyer)}
          className="w-[160px] bg-black-texts text-white hover:bg-mint"
        >
          {t("createAccount")}
        </Button>
      </Col>
    </Row>
  </>;
}

function ProfileForm({ userType, setUserType }: {
  userType: UserTypeT
  setUserType: Dispatch<SetStateAction<UserTypeT | undefined>>;
}) {
  const authUser = useUser();
  const router = useRouter();
  const locale = useLocale();
  const form = useForm<UserFormT>({
    defaultValues: {
      email: authUser.user?.emailAddresses[0].emailAddress ?? "",
      phone: "",
      userType,
      country: "",
      postCode: "",
      address: "",
      addressDetail: "",
      agreed: false,
    },
  });

  // 필수 필드 체크
  const allValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  const checkRequiredFieldsFilled = (values: UserFormT) => {
    return !!(values.phone && values.agreed);
  };
  useEffect(() => {
    setAllRequiredFilled(checkRequiredFieldsFilled(allValues));
  }, [allValues]);

  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner />;
  }
  return <Form {...form}>
    <form onSubmit={form.handleSubmit(async (userForm) => {
      setSubmissionInProgress(true);
      await createUser(userForm);
      setSubmissionInProgress(false);
      router.replace("/");
    })}>
      <span className="text-black">
        {/*TODO 번역 적용*/}
        선택한 사용자 유형: {userType === UserTypeT.Creator ? "저작권자" : "바이어"}
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
                placeholder="휴대폰 번호(숫자만 입력)"
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
                    <SelectValue placeholder={"국가 선택"}/>
                  </SelectTrigger>
                  <SelectContent>
                    {NATION_DATA.map((item) => (
                      <SelectItem key={item.label} value={item.value}>
                        {item.label}
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
          name="postCode"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-gray"
                  type="text"
                  inputMode="numeric"
                  placeholder="우편번호 입력"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </Row>

      <Gap y={5}/>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="border-gray"
                type="text"
                placeholder="주소 입력"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Gap y={5}/>

      <FormField
        control={form.control}
        name="addressDetail"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                className="border-gray"
                type="text"
                placeholder="상세주소 입력"
              />
            </FormControl>
          </FormItem>
        )}
      />


      <Gap y={10}/>

      <hr className="border-gray"/>

      <Gap y={10}/>

      <Row className="px-4 py-2 text-black-texts text-[11pt] border border-gray rounded-t-sm">
        <Gap x={1}/>
        WebtoonLike 이용약관
        <Gap x={1}/>
        <span className="text-red">(필수)</span>
      </Row>

      <Col className="h-[350px] overflow-y-scroll border border-gray rounded-b-sm">
        <Row className="sticky top-0 p-3 justify-center bg-gray-light/90">
          <Text className="text-sm text-black-texts">
            이용약관에 동의하시겠습니까?
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
        <Col className="p-3 pt-0">
          <Text className="text-black-texts text-[16px] font-bold bg">
            Webtoonlike 이용약관
          </Text>
          <Gap y={2}/>
          {locale === "ko" ? <TermsOfUseKo/> : <TermsOfUseEn/>}
        </Col>
        <Gap y={5}/>
      </Col>

      <Gap y={10}/>

      <Row className="w-full justify-between">
        <Button
          className="w-[49%] bg-black-texts text-white hover:text-black"
          onClick={() => setUserType(undefined)}
        >
          이전
        </Button>
        <Input
          type="submit"
          className="w-[49%] bg-black-texts text-white hover:text-black"
          disabled={!allRequiredFilled}
          value="다음"
        />
      </Row>
      <Gap y={40}/>
    </form>
  </Form>
  ;

}