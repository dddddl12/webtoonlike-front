import Image from "next/image";
import { Gap, Row } from "@/shadcn/ui/layouts";
import { FormControl, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { ImageObject } from "@/utils/media";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shadcn/ui/button";
import { SignUpStage } from "@/resources/users/user.types";

export function AccountFormImageField({ image, setImage, placeholder }: {
  image: ImageObject;
  setImage: Dispatch<SetStateAction<ImageObject>>;
  placeholder: string;
}){
  const tGeneral = useTranslations("general");
  return <>
    {image.url && <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm mx-auto">
      <Image
        draggable={false}
        priority
        src={image.url}
        alt={"thumbnail"}
        className="bg-white "
        style={{ objectFit: "cover" }}
        fill
      />
      <Gap y={5}/>
    </div>}

    <FormItem>
      <FormControl>
        <Input
          type="file"
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={(event) => {
            const imageData = new ImageObject(event.target.files?.[0]);
            setImage(imageData);
          }}
        />
      </FormControl>
      <FormLabel className="flex h-10 w-full cursor-pointer">
        <div
          className="flex-1 border rounded-l-md bg-background px-3 py-2 ring-offset-background text-muted-foreground text-base md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
          {image?.displayUrl || placeholder}
        </div>
        <div className="flex border-y border-r rounded-r-md bg-mint text-white items-center px-3">
          {tGeneral("selectFile")}
        </div>
      </FormLabel>
    </FormItem>
  </>;
}

export function AccountFormFooter({ isValid, setSignUpStage, goNextLabel }: {
  isValid: boolean;
  setSignUpStage: Dispatch<SetStateAction<SignUpStage>>;
  goNextLabel?: string;
}){
  const tGeneral = useTranslations("general");
  return <Row className="w-full justify-between">
    <Button
      className="w-[49%] bg-black-texts text-white hover:text-black"
      onClick={(e) => {
        e.preventDefault();
        setSignUpStage(prev => prev - 1);
      }}
    >
      {tGeneral("goBack")}
    </Button>
    <Button
      className="w-[49%] bg-black-texts text-white hover:text-black"
      disabled={!isValid}
    >
      {goNextLabel ?? tGeneral("goNext")}
    </Button>
  </Row>;
}