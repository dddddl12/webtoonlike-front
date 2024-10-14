"use client";

import { Col, Gap, Row } from "@/ui/layouts";
import { Button } from "@/ui/shadcn/Button";
import { Input } from "@/ui/shadcn/Input";
import { Label } from "@/ui/shadcn/Label";
import { Text } from "@/ui/texts";
import { useSnackbar } from "@/hooks/Snackbar";
import * as WebtoonEpisodeApi from "@/apis/webtoon_episodes";
import { WebtoonEpisodeT, WebtoonT } from "@/types";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { getServerUserInfo } from "@/utils/auth/server";

type AddEnglishEpisodeUrlProps = {
  webtoon: WebtoonT;
  episode: WebtoonEpisodeT;
};

export function AddEnglishEpisodeUrl({ webtoon, episode }: AddEnglishEpisodeUrlProps) {
  const user = getServerUserInfo();
  const { enqueueSnackbar } = useSnackbar();
  const [editEnglishUrl, setEditEnglishUrl] = useState<string>("");
  const t = useTranslations("administratorFeatures");

  async function handleAddEnglishEpisodeUrl() {
    try {
      await WebtoonEpisodeApi.update(
        episode.id,
        { englishUrl: editEnglishUrl }
      );
      enqueueSnackbar(`${t("success")}`, { variant: "success" });
    } catch (e) {
      enqueueSnackbar(`${t("error")}`, { variant: "error" });
    }
  }

  return (
    user.adminLevel > 0
      ? <Col>
        <Text className="text-xl text-white font-bold">{t("administratorFeatures")}</Text>
        <Gap y={5} />
        <Row>
          <Col className="w-full">
            <Label htmlFor="englishUrl" className="ml-2">{t("addEpisodeURLheader")}</Label>
            <Gap y={1} />
            <Row>
              <Input
                type="text"
                id="englishUrl"
                name="englishUrl"
                className="text-black"
                placeholder={episode.englishUrl ? episode.englishUrl : `${t("addEnglishEpisodeURLPlaceholder")}`}
                onChange={(e) => { setEditEnglishUrl(e.target.value); }}
              />
              <Gap x={5} />
              <Button className="bg-mint"
                onClick={handleAddEnglishEpisodeUrl}>{t("register")}</Button>
            </Row>
          </Col>
        </Row>
        <Gap y={5} />
      </Col>
      : null
  );
}
