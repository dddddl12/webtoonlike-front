import { useEffect, useState } from "react";
import { Col, Gap, Row } from "@/components/ui/layouts";
import { Text } from "@/components/ui/texts";
import { Label } from "@/components/ui/shadcn/Label";
import { Input } from "@/components/ui/shadcn/Input";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/shadcn/Select";
import MultipleSelector from "@/components/ui/shadcn/MultipleSelector";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import {
  BuyerCompanyFieldSchema,
  BuyerCompanyTypeSchema,
  BuyerFormSchema,
  BuyerFormT, BuyerPurposeSchema,
  BuyerT
} from "@/resources/buyers/buyer.types";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/shadcn/Form";
import Spinner from "@/components/Spinner";
import { createBuyer } from "@/resources/buyers/buyer.service";
import { ImageObject } from "@/utils/media";
import { FileDirectoryT } from "@/resources/files/files.type";


export default function BuyerProfileForm({ prev } : {
  prev?: BuyerT;
}) {
  // 번역
  const t = useTranslations("buyerInfoPage");
  const tGeneral = useTranslations("general");
  const tBusinessFields = useTranslations("businessFields");

  const prevCompany = prev?.company;
  const [thumbnail, setThumbnail] = useState(
    new ImageObject(prevCompany?.thumbPath));
  const [businessCert, setBusinessCert ] = useState(
    new ImageObject(prevCompany?.businessCertPath));
  const [businessCard, setBusinessCard] = useState(
    new ImageObject(prevCompany?.businessCardPath));

  const form = useForm<BuyerFormT>({
    defaultValues: {
      company: {
        name: prevCompany?.name || "",
        fieldType: prevCompany?.fieldType || [],
        businessType: prevCompany?.businessType || [],
        dept: prevCompany?.dept || "",
        position: prevCompany?.position || "",
        positionDetail: prevCompany?.positionDetail || "",
        businessNumber: prevCompany?.businessNumber || "",
      },
      purpose: prev?.purpose,
    }
  });

  // 필수 필드 체크
  const fieldValues = form.watch();
  const [allRequiredFilled, setAllRequiredFilled] = useState(false);
  useEffect(() => {
    const refinedForm: BuyerFormT = {
      ...fieldValues,
      company: {
        ...fieldValues.company,
        thumbPath: thumbnail.url,
        businessCertPath: businessCert.url,
        businessCardPath: businessCard.url
      }
    };
    const { success } = BuyerFormSchema.safeParse(refinedForm);
    setAllRequiredFilled(success);
  }, [fieldValues, thumbnail, businessCert, businessCard]);

  // 제출 이후 동작
  const router = useRouter();
  const onSubmit = async (buyerForm: BuyerFormT) => {
    setSubmissionInProgress(true);

    buyerForm.company.thumbPath = await thumbnail.uploadAndGetRemotePath(FileDirectoryT.BuyersThumbnails);
    buyerForm.company.businessCertPath = await businessCert.uploadAndGetRemotePath(FileDirectoryT.BuyersCerts);
    buyerForm.company.businessCardPath = await businessCard.uploadAndGetRemotePath(FileDirectoryT.BuyersCards);

    await createBuyer(buyerForm); //TODO 실패 케이스 고려
    router.refresh();
  };

  // 스피너
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  if (submissionInProgress) {
    return <Spinner />;
  }
  return (
    <>
      <span className="text-black mb-10">{t("headerDesc")}</span>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="company.businessNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    inputMode="numeric"
                    placeholder={t("businessRegPlaceholder") + " *"}
                  />
                  {/* TODO  필수 표시*/}
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="company.fieldType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/*  TODO*/}
                  <MultipleSelector
                    className="border-gray px-1 py-2 rounded-sm"
                    onChange={field.onChange}
                    defaultOptions={BuyerCompanyFieldSchema.options
                      .map(value => ({
                        label: tBusinessFields(value, { plural: false }), value
                      }))}
                    placeholder={t("businessFieldPlaceholder") + " (멀티셀렉트 재구현 예정)"}
                    hidePlaceholderWhenSelected
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="company.businessType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultipleSelector
                    className="border-gray px-1 py-2 rounded-sm"
                    onChange={field.onChange}
                    defaultOptions={BuyerCompanyTypeSchema.options
                      .map(value => ({
                        label: t(`businessTypeItems.${value}`), value
                      }))}
                    placeholder={t("businessTypePlaceholder")}
                    hidePlaceholderWhenSelected
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Row className="justify-between">
            <Label htmlFor="businessCert"
              className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
              <Text className="text-[#94A4B8]  text-[10pt]">
                {businessCert?.url || t("uploadBusinessReg")}
              </Text>
              <Label htmlFor="businessCert"
                className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
            </Label>

            <FormItem>
              <FormControl>
                <Input
                  className="hidden h-0 border border-red"
                  type='file'
                  accept='image/jpeg, image/png'
                  onChange={(event) => {
                    const imageData = new ImageObject(event.target.files?.[0]);
                    setBusinessCert(imageData);
                  }}
                />
              </FormControl>
            </FormItem>

          </Row>

          <Gap y={10}/>

          <hr className="border-gray"/>

          <Gap y={10}/>

          <FormField
            control={form.control}
            name="company.name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertCompanyName") + " *"}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Row className="justify-between">
            <Col className="w-full justify-center items-center">
              {thumbnail.url && <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                <Image
                  draggable={false}
                  priority
                  src={thumbnail.url}
                  alt={"thumbnail"}
                  className="bg-white "
                  style={{ objectFit: "cover" }}
                  fill
                />
                <Gap y={5}/>
              </div>}
              <Label htmlFor="thumbnail"
                className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
                <Text className="text-[#94A4B8]  text-[10pt]">
                  {thumbnail?.url || t("insertCompanyLogo")}
                </Text>
                <Label htmlFor="thumbnail"
                  className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer">{t("selectFile")}</Label>
              </Label>
            </Col>
            <FormItem>
              <FormControl>
                <Input
                  className="hidden h-0 border border-red"
                  type='file'
                  accept='image/jpeg, image/png'
                  onChange={(event) => {
                    const imageData = new ImageObject(event.target.files?.[0]);
                    setThumbnail(imageData);
                  }}
                />
              </FormControl>
            </FormItem>
          </Row>

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="company.dept"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertBusinessUnit")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="company.position"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertBusinessPosition")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <FormField
            control={form.control}
            name="company.positionDetail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray"
                    type='text'
                    placeholder={t("insertInChargeOf")}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Row className="justify-between">
            <Label htmlFor="businessCard"
              className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer ">
              <Text className="text-[#94A4B8]  text-[10pt]">
                {businessCard?.url || t("attachEmploymentCert")}
              </Text>
              <Label htmlFor="businessCard"
                className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer">{t("selectFile")}</Label>
            </Label>
            <FormItem>
              <FormControl>
                <Input
                  className="hidden h-0 border border-red"
                  type='file'
                  accept='image/jpeg, image/png'
                  onChange={(event) => {
                    const imageData = new ImageObject(event.target.files?.[0]);
                    setBusinessCard(imageData);
                  }}
                />
              </FormControl>
            </FormItem>
          </Row>

          <Gap y={10}/>

          <hr className="border-gray"/>

          <Gap y={10}/>

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select defaultValue={prev?.purpose ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="bg-white border-gray text-[#94A4B8] rounded-sm">
                      <SelectValue placeholder={t("purposePlaceholder")}/>
                    </SelectTrigger>
                    <SelectContent>
                      {BuyerPurposeSchema.options.map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`purpose.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </FormControl>
              </FormItem>
            )}
          />

          <Gap y={5}/>

          <Input
            type="submit"
            className="w-full bg-black-texts text-white hover:text-black"
            value={prev
              ? `${tGeneral("edit")}` : `${tGeneral("submit")}`}
            disabled={!allRequiredFilled}
          />
        </form>
      </Form>
    </>
  );
}