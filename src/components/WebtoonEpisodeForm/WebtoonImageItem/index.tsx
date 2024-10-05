"use client";

import React, { FormEvent } from "react";
import { Text } from "@/ui/texts";
import { Col, Gap, Row } from "@/ui/layouts";
import { Checkbox } from "@/ui/shadcn/CheckBox";
import { Button } from "@/ui/shadcn/Button";
import { buildImgUrl } from "@/utils/media";
import { IconClose } from "@/components/svgs/IconClose";
import { useAlertDialog, useConfirmDialog } from "@/hooks/ConfirmDialog";
import { WebtoonEpisodeImageT, WebtoonEpisodeImageFormT } from "@/types";
import { useTranslations } from "next-intl";

type WebtoonImageItemProps = {
  image: File | WebtoonEpisodeImageT | WebtoonEpisodeImageFormT;
  index: number;
  isSelected: boolean;
  onToggleSelection: () => void;
  onDeleteEpisode: (idx: number) => void;
};

export function WebtoonImageItem({
  image,
  index,
  isSelected,
  onToggleSelection,
  onDeleteEpisode,
}: WebtoonImageItemProps): JSX.Element {
  const { showAlertDialog } = useAlertDialog();
  const { showConfirmDialog } = useConfirmDialog();
  const t = useTranslations("detailedInfoPage");


  async function handleOpenImageClick() {
    const isOk = await showConfirmDialog({
      main: (
        <img src={image instanceof File ?
          URL.createObjectURL(image) :
          buildImgUrl(null, image.path)
        }
        alt={image instanceof File ?
          image.name :
          image.path
        }
        className='w-full' />
      ),
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
  }

  async function handleDeleteClick(index: number): Promise<void> {
    const isOk = await showAlertDialog({
      title: `${t("episodeDelete")}`,
      body: `${t("areYouSure")}`,
      useOk: true,
      useCancel: true,
    });
    if (!isOk) {
      return;
    }
    try {
      onDeleteEpisode(index);
    } catch (e) {
      console.warn(e);
    }
  }

  const fileName = image instanceof File ? image.name : image.path;

  return (
    <Row className="justify-between mr-[50px]">
      <Row className="overflow-hidden w-full" onClick={onToggleSelection}>
        <Checkbox className="border-white" checked={isSelected} />
        <Gap x={2} />
        <Text className="text-white">{fileName}</Text>
        <Gap x={3} />
      </Row>
      <Row>
        <Button onClick={() => { handleOpenImageClick(); }} className="p-2 h-auto bg-transparent text-mint underline">
          {t("preview")}
        </Button>
        <Button onClick={() => { handleDeleteClick(index); }} className="w-[10px] h-[10px] p-3 bg-transparent flex items-center justify-center">
          <Text>
            <IconClose className="fill-gray-text" />
          </Text>
        </Button>
      </Row>
    </Row>
  );
}
