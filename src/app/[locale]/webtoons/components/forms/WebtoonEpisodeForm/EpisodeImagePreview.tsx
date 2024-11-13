import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { ReactNode } from "react";
import Image from "next/image";
import { EpisodeImageSet } from "@/app/[locale]/webtoons/components/forms/WebtoonEpisodeForm/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function EpisodeImagePreview({ imageSets, children }: {
  imageSets: EpisodeImageSet[];
  children: ReactNode;
}) {
  return <Dialog>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent>
      <VisuallyHidden>
        <DialogTitle/>
      </VisuallyHidden>
      {imageSets.map(({ image }, i) => {
        if (!image.url) {
          return null;
        }
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