import Image from "next/image";
import { FormControl } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { ImageObject } from "@/utils/media";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function useAccountFormImage(prevPath?: string){
  const [image, setImage] = useState(new ImageObject(prevPath));
  const tGeneral = useTranslations("general");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const element = (placeholder: string) => <>
    {image.url && <div className="w-[200px] h-[200px] overflow-hidden relative rounded-sm mx-auto mb-5">
      <Image
        draggable={false}
        priority
        src={image.url}
        alt={"thumbnail"}
        className="bg-white "
        style={{ objectFit: "cover" }}
        fill
      />
    </div>}
    <div>
      <FormControl>
        <Input
          type="file"
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={(event) => {
            const imageData = new ImageObject(event.target.files?.[0]);
            setImage(imageData);
          }}
          ref={fileInputRef}
        />
      </FormControl>
      <div className="flex h-10 w-full cursor-pointer"
        onClick={() => fileInputRef.current?.click()}>
        <div
          className="flex-1 border border-input rounded-l-md bg-background px-3 py-2 ring-offset-background text-muted-foreground text-base md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis">
          {image?.displayUrl || placeholder}
        </div>
        <div className="flex border-y border-r border-input rounded-r-md bg-mint text-white items-center px-3 text-sm">
          {tGeneral("selectFile")}
        </div>
      </div>
    </div>
  </>;
  return { element, image };
}
