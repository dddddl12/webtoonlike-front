"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Col, Gap, Row } from "@/ui/layouts";
import { Text } from "@/ui/texts";
import { Label } from "@/ui/shadcn/Label";
import { Input } from "@/ui/shadcn/Input";
import { Button } from "@/ui/shadcn/Button";
import * as CreatorApi from "@/apis/creators";
import type { CreatorT, CreatorFormT } from "@/types";
import { uploadToS3 } from "@/utils/s3";
import Image from "next/image";
import { buildImgUrl } from "@/utils/media";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/Select";
import { useTranslations } from "next-intl";
import { getUserInfo } from "@/utils/authedUser";

type CreatorProfileFormProps = {
  creator?: CreatorT;
  onSubmit: (form: CreatorFormT) => any;
};

export function CreatorProfileForm({
  creator: prevCreator,
  onSubmit,
}: CreatorProfileFormProps) {
  const [agency, setAgency] = useState<string | null>(null);
  const [isNew, setIsNew] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [name_en, setName_en] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | string | null>();

  const user = getUserInfo();
  const t = useTranslations("setupPageNextForCreators");
  const tMyInfoPage = useTranslations("myInfoPage");

  useEffect(() => {
    if (prevCreator) {
      setThumbnail(prevCreator.thumbPath);
      setAgency(prevCreator.agencyName);
      setName(prevCreator.name);
      setName_en(prevCreator.name_en ?? "");
      if (prevCreator.isNew) {
        setIsNew("신인");
      } else if (prevCreator.isNew) {
        setIsNew("경력");
      }
    }
  }, [prevCreator?.userId]);

  function handleAgencyChange(value: string): void {
    setAgency(value);
  }

  function handleNewManChange(value: string): void {
    setIsNew(value);
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setName(val);
  }

  function handleName_enChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setName_en(val);
  }

  async function onThumbnailChange(
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length == 0) {
      return;
    }
    const newFile = newFiles[0];
    setThumbnail(newFile);
  }

  async function handleSubmitClick() {
    let thumbPath: string | null = null;
    if (thumbnail instanceof File) {
      const { putUrl, key } = await CreatorApi.getThumbnailPresignedUrl(
        thumbnail.type
      );
      await uploadToS3(putUrl, thumbnail);
      thumbPath = key;
    } else {
      thumbPath = thumbnail ?? null;
    }

    const form: CreatorFormT = {
      userId: user.id,
      name,
      name_en,
      thumbPath,
      agencyName: agency,
      isNew: isNew === "신인" ? true : false,
      isExposed: false,
    };

    onSubmit(form);
  }

  return (
    <Col>
      <span className="text-black">{tMyInfoPage("profileDesc")}</span>
      <Gap y={10} />

      <Row className="justify-between">
        {thumbnail != null ? (
          <>
            {thumbnail instanceof File ? (
              <Col className="w-full justify-center items-center">
                {thumbnail && (
                  <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                    <Image
                      draggable={false}
                      priority
                      src={URL.createObjectURL(thumbnail)}
                      alt={"thumbnail"}
                      className="bg-white"
                      style={{ objectFit: "cover" }}
                      fill
                    />
                  </div>
                )}
                <Gap y={5} />
                <Label
                  htmlFor="thumbnail"
                  className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer"
                >
                  <Text className="text-[#94A4B8]  text-[10pt]">
                    {thumbnail instanceof File && thumbnail.name}
                  </Text>
                  <Label
                    htmlFor="thumbnail"
                    className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white  cursor-pointer"
                  >
                    {t("selectFile")}
                  </Label>
                </Label>
              </Col>
            ) : (
              <Col className="w-full justify-center items-center">
                <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm">
                  <Image
                    draggable={false}
                    priority
                    src={buildImgUrl(null, thumbnail)}
                    alt={"thumbnail"}
                    className="bg-white"
                    style={{ objectFit: "cover" }}
                    fill
                  />
                </div>
                <Gap y={5} />
                <Label
                  htmlFor="thumbnail"
                  className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer"
                >
                  <Text className="text-[#94A4B8]  text-[10pt]">
                    {buildImgUrl(null, thumbnail)}
                  </Text>
                  <Label
                    htmlFor="thumbnail"
                    className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer"
                  >
                    {t("selectFile")}
                  </Label>
                </Label>
              </Col>
            )}
          </>
        ) : (
          <Label
            htmlFor="thumbnail"
            className="relative flex flex-col justify-center items-left w-full px-3 py-3 rounded-sm border border-gray bg-gray-white overflow-hidden cursor-pointer"
          >
            <Text className="text-[#94A4B8]  text-[10pt]">
              {t("uploadProfilePic")}
            </Text>
            <Label
              htmlFor="thumbnail"
              className="absolute flex justify-center items-center p-2 right-0 bg-mint h-full text-white cursor-pointer"
            >
              {t("selectFile")}
            </Label>
          </Label>
        )}
        <Input
          className="hidden h-0 border border-red"
          id="thumbnail"
          type="file"
          accept="image/jpeg, image/png"
          onChange={onThumbnailChange}
        />
      </Row>

      <Gap y={5} />

      <Select
        defaultValue={prevCreator ? `${prevCreator?.agencyName}` : ""}
        onValueChange={handleAgencyChange}
      >
        <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm">
          <SelectValue
            placeholder={
              prevCreator
                ? `${prevCreator?.agencyName}`
                : `${t("affiliationWithAnotherAgencyQuestion")}`
            }
          >
            {agency}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={t("affiliation")}>{t("affiliation")}</SelectItem>
          <SelectItem value={t("noAffiliation")}>
            {t("noAffiliation")}
          </SelectItem>
        </SelectContent>
      </Select>

      <Gap y={5} />

      <Select
        defaultValue={prevCreator ? `${prevCreator?.isNew}` : ""}
        onValueChange={handleNewManChange}
      >
        <SelectTrigger className="bg-white border-gray text-black-texts rounded-sm">
          <SelectValue
            placeholder={
              prevCreator
                ? `${prevCreator?.isNew ? t("rookie") : t("experienced")}`
                : `${t("selectYourWorkExperience")}`
            }
          >
            {isNew}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={t("rookie")}>{t("rookie")}</SelectItem>
          <SelectItem value={t("experienced")}>{t("experienced")}</SelectItem>
        </SelectContent>
      </Select>

      <Gap y={5} />

      <Input
        className="border-gray"
        type="text"
        placeholder={t("username")}
        value={name}
        onChange={handleNameChange}
      />
      <Gap y={5} />

      <Input
        className="border-gray"
        type="text"
        placeholder={t("usernameInEnglish")}
        value={name_en}
        onChange={handleName_enChange}
      />
      <Gap y={10} />

      <hr className="border-gray" />

      <Gap y={10} />

      <Button
        className="w-full bg-black-texts text-white hover:text-black"
        onClick={handleSubmitClick}
      >
        {prevCreator ? `${t("edit")}` : `${t("submit")}`}
      </Button>
      <Gap y={40} />
    </Col>
  );
}
