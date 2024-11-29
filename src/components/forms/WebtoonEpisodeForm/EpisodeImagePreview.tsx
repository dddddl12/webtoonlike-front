import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { ReactNode } from "react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { EpisodeImageObject } from "@/components/forms/WebtoonEpisodeForm/hook";

export default function EpisodeImagePreview({ images, children }: {
  images: EpisodeImageObject[];
  children: ReactNode;
}) {
  return <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="max-w-2xl max-h-[80%] overflow-y-auto">
      <VisuallyHidden>
        <DialogTitle/>
        <DialogDescription/>
      </VisuallyHidden>
      <div>
        {images.map((image, i) => {
          return <Image
            key={i}
            src={image.url}
            alt={image.url}
            width={672}
            height={0}
            style={{ objectFit: "cover" }}
          />;
        })}
      </div>
    </DialogContent>
  </Dialog>;

}