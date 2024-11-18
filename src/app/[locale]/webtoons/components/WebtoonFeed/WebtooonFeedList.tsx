"use client";

import { Gap, Row } from "@/shadcn/ui/layouts";
import { useLocale, useTranslations } from "next-intl";
import { AgeLimit } from "@/resources/webtoons/webtoon.types";
import { listWebtoons, WebtoonFilterT, WebtoonPreviewT } from "@/resources/webtoons/webtoon.service";
import { ListResponse } from "@/resources/globalTypes";
import { useListData } from "@/hooks/listData";
import { displayName } from "@/utils/displayName";
import WebtoonGridPaginated from "@/components/WebtoonGridPaginated";
import { BasicGenreT } from "@/resources/genres/genre.service";
import { FieldName, Form, FormControl, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { useForm, UseFormReturn } from "react-hook-form";
import { Button } from "@/shadcn/ui/button";

export default function WebtooonFeedList({
  genres, initialWebtoonListResponse,
}: {
  genres: BasicGenreT[];
  initialWebtoonListResponse: ListResponse<WebtoonPreviewT>;
}) {

  const initialFilters: WebtoonFilterT = {
    page: 1,
    genreIds: [],
    ageLimits: [],
  };
  const { listResponse, filters, setFilters } = useListData(
    listWebtoons, initialFilters, initialWebtoonListResponse);

  const form = useForm<WebtoonFilterT>({
    defaultValues: initialFilters
  });

  const locale = useLocale();
  const Tage = useTranslations("ageRestriction");

  return (
    <>
      {/*<Form {...form}>*/}
      {/*  <form>*/}
      {/*    <FilterSelector*/}
      {/*      form={form}*/}
      {/*      name="genreIds"*/}
      {/*      items={genres.map((genre) => (*/}
      {/*        {*/}
      {/*          label: displayName(locale, genre.label, genre.label_en),*/}
      {/*          value: genre.id*/}
      {/*        }*/}
      {/*      ))}*/}
      {/*    />*/}
      {/*    <FilterSelector*/}
      {/*      form={form}*/}
      {/*      name="ageLimits"*/}
      {/*      items={Object.values(AgeLimit).map((item) => (*/}
      {/*        {*/}
      {/*          label: Tage(item),*/}
      {/*          value: item*/}
      {/*        }*/}
      {/*      ))}*/}
      {/*    />*/}
      {/*  </form>*/}
      {/*</Form>*/}

      {/*<Gap y={10} />*/}

      <WebtoonGridPaginated
        listResponse={listResponse}
        filters={filters}
        setFilters={setFilters}
        noItemsMessage="관련 웹툰 없음" //TODO
      />
    </>
  );
}
//
// function FilterSelector<T>({ form, name, items }: {
//   form: UseFormReturn<WebtoonFilterT>;
//   name: FieldName<WebtoonFilterT, T[]>;
//   items: {
//     label: string;
//     value: T;
//   }[];
// }){
//   return <div>
//     <FormField
//       control={form.control}
//       name={name}
//       render={() => (
//         <FormItem>
//           {items.map(({ label, value: itemValue }, index) => (
//             <FormField
//               key={index}
//               control={form.control}
//               name={name}
//               render={({ field }) => {
//                 const fieldValue = field.value || [];
//                 return (
//                   <FormItem>
//                     <FormControl>
//                       <Checkbox
//                         checked={(fieldValue as any[]).includes(itemValue)}
//                         onCheckedChange={(checked) => {
//                           return checked
//                             ? field.onChange([...fieldValue, itemValue])
//                             : field.onChange(
//                               fieldValue?.filter(
//                                 (value) => value !== itemValue
//                               )
//                             );
//                         }}
//                       />
//                     </FormControl>
//                     <FormLabel>
//                       {label}
//                     </FormLabel>
//                   </FormItem>
//                 );
//               }}
//             />
//           ))}
//         </FormItem>
//       )}
//     />
//     <Row>
//       <Button onClick={(e) => {
//         e.preventDefault();
//         form.reset(name, []);
//       }}>초기화</Button>
//       <Button>검색</Button>
//     </Row>
//   </div>;
// }
//
