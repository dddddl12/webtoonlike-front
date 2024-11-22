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
    <DialogContent className="max-h-[80%] overflow-y-auto">
      <VisuallyHidden>
        <DialogTitle/>
        <DialogDescription/>
      </VisuallyHidden>
      {images.map((image, i) => {
        return <Image
          key={i}
          src={image.url}
          alt={image.url}
          width={400}
          height={0}
          style={{ objectFit: "cover" }}
        />;
      })}
    </DialogContent>
  </Dialog>;

}