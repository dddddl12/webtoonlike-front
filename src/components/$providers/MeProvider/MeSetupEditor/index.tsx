"use client";
import { useState, ChangeEvent, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { useUser as useAuthUser } from "@clerk/nextjs";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { useUser$, useUserActions } from "@/states/UserState";
import { useSnackbar } from "@/hooks/Snackbar";
import * as UserApi from "@/apis/users";
import { UserFormT, UserT, UserTypeT } from "@/types";
import { Col, Gap, Row } from "@/ui/layouts";
import { IconSignupCreator } from "@/components/svgs/IconSignupCreatori";
import { IconSignupBuyer } from "@/components/svgs/IconSignupBuyer";
import { Text } from "@/ui/texts";
import { Checkbox } from "@/ui/shadcn/CheckBox";
import { nationConverter, nationConverterToKr } from "@/utils/nationConverter";
import { useTranslations, useLocale } from "next-intl";
import { NextIntlClientProvider, useMessages } from "next-intl";
import TermsOfUseKo from "@/common/TermsOfUseKo";
import TermsOfUseEn from "@/common/TermsOfUseEn";

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
  const router = useRouter();
  const authUser = useAuthUser();

  const user$ = useUser$();
  const userAct = useUserActions();
  const { enqueueSnackbar } = useSnackbar();

  const [userType, setUserType] = useState<UserTypeT | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [nation, setNation] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [addressPart1, setAddressPart1] = useState<string>("");
  const [addressPart2, setAddressPart2] = useState<string>("");
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const locale = useLocale();
  const messages = useMessages();
  const t = useTranslations("setupPage");

  const submitDisabled =
    userType == null ||
    fullName == "" ||
    phone == "" ||
    nation == "" ||
    zipCode == "" ||
    addressPart1 == "" ||
    addressPart2 == "" ||
    isConfirm == false;

  function handleUserTypeChange(value: UserTypeT | null): void {
    setUserType(value);
  }

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    const phoneRule = /^[0-9-]+$/;
    if (val == "") {
      setPhone("");
    } else if (phoneRule.test(val)) {
      setPhone(val);
    }
  }

  function handleAddressPart1Change(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setAddressPart1(val);
  }

  function handleFullNameChange(e: ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value;
    setFullName(val);
  }

  function nowUserType() {
    if (userType == "creator") {
      return "저작권자";
    } else if (userType == "buyer") {
      return "바이어";
    } else {
      return "알 수 없음";
    }
  }

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (submitDisabled) {
      return;
    }

    const form: UserFormT = {
      sub: authUser.user?.id ?? "",
      fullName: fullName,
      phone: phone,
      userType: userType ?? "buyer",
      country: nation as
        | "ko"
        | "en"
        | "zhCN"
        | "zhTW"
        | "ja"
        | "fr"
        | "es"
        | "vi"
        | "ms"
        | "th"
        | "all"
        | null,
      postCode: zipCode,
      address: addressPart1,
      addressDetail: addressPart2,
      email: authUser.user?.emailAddresses[0].emailAddress ?? "",
    };

    try {
      const created = await UserApi.createMe(form);
      userAct.patch({ status: "loaded", data: { me: created, admin: null } });
      enqueueSnackbar("user successfully created", { variant: "success" });
    } catch (e) {
      console.warn(e);
      enqueueSnackbar("user create failed", { variant: "error" });
    }
  }, [submitDisabled]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Col>
        {userType === null ? (
          <>
            <span className="text-black">{t("selectMembershipType")}</span>
            <Gap y={20} />

            <Row className="justify-evenly">
              <Col className="justify-center items-center">
                <IconSignupCreator className="fill-black" />
                <Gap y={4} />
                <span className="text-black">{t("membershipCopyrightHolder")}</span>
                <Gap y={4} />
                <Button
                  onClick={() => {
                    handleUserTypeChange("creator" as UserTypeT);
                  }}
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
                  onClick={() => {
                    handleUserTypeChange("buyer" as UserTypeT);
                  }}
                  className="w-[160px] bg-black-texts text-white hover:bg-mint"
                >
                  {t("createAccount")}
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <span className="text-black">
              선택한 사용자 유형: {nowUserType()}
            </span>
            <Gap y={10} />
            <Input
              className="border-gray"
              type="text"
              placeholder="이름 입력"
              value={fullName}
              onChange={handleFullNameChange}
            />

            <Gap y={5} />

            <Input
              className="border-gray"
              type="tel"
              placeholder="휴대폰 번호(숫자만 입력)"
              value={phone}
              onChange={handlePhoneChange}
            />

            <Gap y={10} />

            <hr className="border-gray" />

            <Gap y={10} />

            <Row className="justify-between">
              <Select
                onValueChange={(value) => {
                  setNation(value);
                }}
              >
                <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm w-[48%]">
                  <SelectValue placeholder={!nation || nation === "" ? "국가 선택" : nationConverterToKr(nation)} />
                </SelectTrigger>
                <SelectContent>
                  {NATION_DATA.map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                className="border-gray w-[48%]"
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                placeholder="우편번호 입력"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                }}
              />
            </Row>

            <Gap y={5} />

            <Input
              className="border-gray"
              type="text"
              placeholder="주소 입력"
              value={addressPart1}
              onChange={handleAddressPart1Change}
            />

            <Gap y={5} />

            <Input
              className="border-gray"
              type="text"
              placeholder="상세주소 입력"
              value={addressPart2}
              onChange={(e) => {
                setAddressPart2(e.target.value);
              }}
            />

            <Gap y={10} />

            <hr className="border-gray" />

            <Gap y={10} />

            <Row className="px-4 py-2 text-black-texts text-[11pt] border border-gray rounded-t-sm">
              {/* <Row
                      className={`w-[15px] h-[15px] border border-gray shadow-sm rounded-sm ${
                        isConfirm ? "bg-mint" : "bg-white"
                      }`}
                    >
                      {isConfirm && <Check />}
                    </Row> */}
              <Gap x={1} />
              WebtoonLike 이용약관
              <Gap x={1} />
              <span className="text-red">(필수)</span>
            </Row>

            <Col className="h-[350px] overflow-y-scroll border border-gray rounded-b-sm">
              <Row className="sticky top-0 p-3 justify-center bg-gray-light/90">
                <Text className="text-sm text-black-texts">
                  이용약관에 동의하시겠습니까?
                </Text>
                <Gap x={1} />
                <Checkbox
                  className="drop-shadow-lg"
                  onCheckedChange={(checked) => {
                    setIsConfirm(Boolean(checked));
                  }}
                />
              </Row>
              <Col className="p-3 pt-0">
                <Text className="text-black-texts text-[16px] font-bold bg">
                  Webtoonlike 이용약관
                </Text>
                <Gap y={2} />
                {locale === "ko" ? <TermsOfUseKo /> : <TermsOfUseEn />}
              </Col>
              <Gap y={5} />
            </Col>

            <Gap y={10} />

            <Row className="w-full justify-between">
              <Button
                className="w-[49%] bg-black-texts text-white hover:text-black"
                onClick={() => {
                  handleUserTypeChange(null);
                }}
              >
                이전
              </Button>
              <Button
                className="w-[49%] bg-black-texts text-white hover:text-black"
                onClick={handleSubmit}
                disabled={submitDisabled}
              >
                다음
              </Button>
            </Row>
            <Gap y={40} />
          </>
        )}
      </Col>
    </NextIntlClientProvider>
  );
}
