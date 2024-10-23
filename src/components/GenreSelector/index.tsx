"use client";
import React, { useEffect, Fragment } from "react";
// import { useListData } from "@/hooks/ListData";
import { Row } from "@/ui/layouts";
import { Badge } from "@/ui/shadcn/Badge";
import Spinner from "../Spinner";
import { ErrorComponent } from "../ErrorComponent";
import { useLocale } from "next-intl";
import { GenreT } from "@/resources/genres/genre.types";

type GenreSelectorProps = {
  withAll?: boolean
  selected: GenreT[];
  onGenreSelect: (genre?: GenreT) => void;
}

export function GenreSelector({
  withAll,
  selected,
  onGenreSelect,
}: GenreSelectorProps): JSX.Element {
  return <></>;
  // const locale = useLocale();
  // const { data: genres$, actions: genresAct } = useListData({
  //   listFn: GenreApi.list
  // });
  //
  // useEffect(() => {
  //   genresAct.load({});
  // }, []);
  //
  // function handleClickGenre(genre?: GenreT) {
  //   onGenreSelect(genre);
  // }
  //
  // if (genres$.status === "idle" || genres$.status === "loading") {
  //   return (
  //     <Spinner />
  //   );
  // }
  // if (genres$.status === "error") {
  //   return (
  //     <ErrorComponent />
  //   );
  // }
  //
  // return (
  //   <Row className="items-center justify-center">
  //     <Row className="w-[1200px] flex-wrap gap-x-2">
  //       {withAll && (
  //         <Badge
  //           onClick={() => handleClickGenre()}
  //           style={{ backgroundColor: selected == null ? "white" : "transparent", color: selected == null ? "black" : "white" }}
  //           className=" my-1 cursor-pointer rounded-full bg-transparent text-white border border-white hover:text-black"
  //         >
  //           {locale === "ko" ? "전체" : "All"}
  //         </Badge>
  //       )}
  //
  //       {genres$.data.map((item) => {
  //         const isSelected = selected.find((genre) => genre.id === item.id) !== undefined;
  //
  //         return (
  //           <Fragment key={item.id}>
  //             <Badge
  //               onClick={() => handleClickGenre(item)}
  //               style={{ backgroundColor: isSelected ? "white" : "transparent", color: isSelected ? "black" : "white" }}
  //               className=" my-1 cursor-pointer rounded-full bg-transparent text-white border border-white hover:text-black"
  //             >
  //               {locale === "ko" ? item.label : item.label_en ?? item.label}
  //             </Badge>
  //           </Fragment>
  //         );
  //       }
  //       )}
  //     </Row>
  //   </Row>
  // );

}