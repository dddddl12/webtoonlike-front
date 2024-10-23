// "use client";
//
// import {
//   useState,
//   useRef,
//   useEffect,
//   ChangeEvent,
//   ReactNode,
// } from "react";
// import { Text } from "@/ui/texts";
// import { Label } from "@/ui/shadcn/Label";
// import { Input } from "@/ui/shadcn/Input";
// import { Button } from "@/ui/shadcn/Button";
// import { Col, Row, Gap } from "@/ui/layouts";
// import { uploadToS3 } from "@/utils/s3";
// import { useSnackbar } from "@/hooks/Snackbar";
// import { useAlertDialog, useConfirmDialog } from "@/hooks/ConfirmDialog";
// import { WebtoonImageItem } from "./WebtoonImageItem";
// // logic
// import { buildImgUrl } from "@/utils/media";
// import { generateRandomString } from "@/utils/randomString";
// import { IconUpload } from "../svgs/IconUpload";
// import { IconUpArrow } from "../svgs/IconUpArrow";
// import { IconDownArrow } from "../svgs/IconDownArrow";
// import { IconRightBrackets } from "../svgs/IconRightBrackets";
// import { useLocale, useTranslations } from "next-intl";
//
// type WebtoonEpisodeFormProps = {
//   webtoonId: number;
//   episode?: WebtoonEpisodeT;
//   onSubmit: (
//     form: WebtoonEpisodeFormT,
//     images: WebtoonEpisodeImageFormT[]
//   ) => any;
// };
//
// const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
//
// export function WebtoonEpisodeForm({
//   webtoonId,
//   episode,
//   onSubmit,
// }: WebtoonEpisodeFormProps) {
//   const { enqueueSnackbar } = useSnackbar();
//   const { showAlertDialog } = useAlertDialog();
//   const { showConfirmDialog } = useConfirmDialog();
//   // const [title, setTitle] = useState<string>("");
//   // const [title_en, setTitle_en] = useState<string>("");
//   const [episodeNo, setEpisodeNo] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [thumbnail, setThumbnail] = useState<File | string | null>();
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const [episodeImages, setEpisodeImages] = useState<
//     (WebtoonEpisodeImageFormT | File)[]
//       >([]);
//   const [selectedImages, setSelectedImages] = useState<boolean[]>(
//     episodeImages.map(() => false)
//   );
//   const locale = useLocale();
//   const user = getServerUserInfo();
//   const submitDisabled = isSubmitting || episodeNo === null || episodeNo === "" || episodeImages.length == 0;
//   const t = useTranslations("detailedInfoPage");
//   useEffect(() => {
//     if (episode) {
//       // episode.title && setTitle(episode.title);
//       // episode.title_en && setTitle_en(episode.title_en);
//       episode.episodeNo && setEpisodeNo(String(episode.episodeNo));
//       episode.thumbPath && setThumbnail(episode.thumbPath);
//     }
//     if (episode?.images) {
//       setEpisodeImages(episode.images);
//     }
//   }, []);
//
//   // function handleTitleChange(e: ChangeEvent<HTMLInputElement>): void {
//   //   const val = e.target.value;
//   //   setTitle(val);
//   // }
//
//   // function handleEnTitleChange(e: ChangeEvent<HTMLInputElement>): void {
//   //   const val = e.target.value;
//   //   setTitle_en(val);
//   // }
//
//   function handleEpisodeNumberChange(e: ChangeEvent<HTMLInputElement>): void {
//     const val = e.target.value;
//     setEpisodeNo(val);
//   }
//
//   function preventLetters(e: React.KeyboardEvent<HTMLInputElement>) {
//     ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
//   }
//
//   async function onThumbnailChange(
//     e: ChangeEvent<HTMLInputElement>
//   ): Promise<void> {
//     const newFiles = e.target.files;
//     if (!newFiles || newFiles.length == 0) {
//       return;
//     }
//     const newFile = newFiles[0];
//     setThumbnail(newFile);
//   }
//
//   async function handleInputImageChange(e: ChangeEvent<HTMLInputElement>) {
//     const newFiles = Array.from(e.target.files ?? []);
//     if (newFiles.length == 0) {
//       return;
//     }
//     const hasFileExceedingMaxSize = newFiles.some(
//       (item) => item.size > MAX_THUMBNAIL_SIZE
//     );
//     if (hasFileExceedingMaxSize) {
//       await showAlertDialog({
//         title: "",
//         body: "파일 중 5MB가 넘는 파일이 있습니다.",
//         useOk: true,
//       });
//     }
//     const filteredFiles = newFiles.filter(
//       (item) => item.size <= MAX_THUMBNAIL_SIZE
//     );
//     setEpisodeImages([...episodeImages, ...filteredFiles]);
//   }
//
//   function handleUploadImageClick(): void {
//     if (inputRef.current) {
//       inputRef.current.value = ""; // to prevent duplicated value
//       inputRef.current.click();
//     }
//   }
//
//   async function handleSubmit() {
//     try {
//       if (!episodeNo) {
//         await showAlertDialog({
//           title: "",
//           body: "에피소드 번호를 입력해주세요",
//           useOk: true,
//         });
//         return;
//       }
//       setIsSubmitting(true);
//       // thumbnail upload
//       let thumbPath: string | null = null;
//       if (thumbnail instanceof File) {
//         const { putUrl, key } = await WebtoonApi.getThumbnailPresignedUrl(
//           thumbnail.type
//         );
//         await uploadToS3(putUrl, thumbnail);
//         thumbPath = key;
//       } else {
//         thumbPath = thumbnail ?? null;
//       }
//
//       // episode images upload
//       const promises = episodeImages.map((img, idx) => {
//         if (img instanceof File) {
//           return async (): Promise<WebtoonEpisodeImageFormT> => {
//             const { putUrl, key } =
//               await WebtoonEpisodeImageApi.getPresignedUrl(img.type);
//             await uploadToS3(putUrl, img);
//             return {
//               episodeId: -1, // dummy
//               path: key,
//               mimeType: img.type,
//               rank: idx,
//             };
//           };
//         } else {
//           return async (): Promise<WebtoonEpisodeImageFormT> => ({
//             ...img,
//             rank: idx,
//           });
//         }
//       });
//
//       const newImgForms = await Promise.all(
//         promises.map((promise) => promise())
//       );
//
//       const form: WebtoonEpisodeFormT = {
//         authorId: user.id,
//         webtoonId: webtoonId,
//         // title,
//         // title_en,
//         episodeNo: Number(episodeNo),
//         thumbPath,
//       };
//       await onSubmit(form, newImgForms);
//     } catch (e) {
//       console.warn(e);
//     } finally {
//       setIsSubmitting(false);
//     }
//   }
//
//   function handleDeleteEpisode(data: number) {
//     setEpisodeImages((prevImage) =>
//       prevImage.filter((cur, idx) => idx !== data)
//     );
//   }
//
//   function renderFullEpisode() {
//     return (
//       <Col>
//         {episodeImages.map((image) => (
//           <img
//             key={generateRandomString()}
//             src={(() => {
//               if (image instanceof File) {
//                 return URL.createObjectURL(image);
//               } else {
//                 return buildImgUrl(null, image.path);
//               }
//             })()}
//             alt={(() => {
//               if (image instanceof File) {
//                 return URL.createObjectURL(image);
//               } else {
//                 return buildImgUrl(null, image.path);
//               }
//             })()}
//             className="w-full"
//           />
//         ))}
//       </Col>
//     );
//   }
//
//   async function handleOpenEpisodeImageClick() {
//     const isOk = await showConfirmDialog({
//       main: renderFullEpisode(),
//       // useCancel: true,
//     });
//     if (!isOk) return;
//   }
//
//   function getSelectedIndexes() {
//     return selectedImages.flatMap((isSelected, index) =>
//       isSelected ? index : []
//     );
//   }
//
//   function areIndexesConsecutive(indexes: number[]) {
//     for (let i = 1; i < indexes.length; i++) {
//       if (indexes[i] !== indexes[i - 1] + 1) {
//         return false; // 체크한 항목이 연속되지 않았을 때
//       }
//     }
//     return true; // 체크한 항목이 연속될 때
//   }
//
//   function handleReorderButtonClick(isUp: boolean) {
//     setEpisodeImages((prevImages: (WebtoonEpisodeImageFormT | File)[]) => {
//       const newImages = [...prevImages];
//       const selectedIndexes = getSelectedIndexes();
//
//       if (
//         selectedIndexes.length > 0 &&
//         !areIndexesConsecutive(selectedIndexes)
//       ) {
//         enqueueSnackbar(
//           "연속되지 않은 항목들은 이동할 수 없습니다. 연속되는 항목들만 선택해 주세요",
//           { variant: "error" }
//         );
//         return prevImages;
//       }
//
//       if (selectedIndexes.length > 0) {
//         const firstIndex = selectedIndexes[0];
//         const lastIndex = selectedIndexes[selectedIndexes.length - 1];
//
//         if (isUp && firstIndex > 0) {
//           // Move to up
//           const moveGroup = newImages.splice(
//             firstIndex,
//             selectedIndexes.length
//           );
//           newImages.splice(firstIndex - 1, 0, ...moveGroup);
//           updateSelectedImagesIndexes(firstIndex - 1, lastIndex - 1);
//         } else if (!isUp && lastIndex < newImages.length - 1) {
//           // Move to down
//           const moveGroup = newImages.splice(
//             firstIndex,
//             selectedIndexes.length
//           );
//           newImages.splice(firstIndex + 1, 0, ...moveGroup);
//           updateSelectedImagesIndexes(firstIndex + 1, lastIndex + 1);
//         }
//       }
//
//       return newImages;
//     });
//   }
//
//   function updateSelectedImagesIndexes(firstIndex: number, lastIndex: number) {
//     setSelectedImages((prevSelectedImages) => {
//       const updatedSelectedImages = new Array(prevSelectedImages.length).fill(
//         false
//       );
//       for (let i = firstIndex; i <= lastIndex; i++) {
//         updatedSelectedImages[i] = true;
//       }
//       return updatedSelectedImages;
//     });
//   }
//
//   function renderWebtoonImageList(): ReactNode {
//     return (
//       <>
//         <Row>
//           <Label htmlFor="episodes">{t("episodeImage")}</Label>
//           <Gap x={2} />
//           <Text className="text-mint text-[10pt]">{locale === "ko" ? "*필수" : "*Required"}</Text>
//         </Row>
//         <Gap y={3} />
//         <Col>
//           {episodeImages.length != 0 ? (
//             <Row className="bg-gray-darker rounded-md px-5 py-2 relative overflow-hidden min-h-[80px]">
//               <Col className="w-full">
//                 {episodeImages.map((image, idx) => (
//                   <WebtoonImageItem
//                     key={idx}
//                     image={image}
//                     index={idx}
//                     isSelected={selectedImages[idx]}
//                     onToggleSelection={() => {
//                       setSelectedImages((prevSelected) => {
//                         const updatedSelected = [...prevSelected];
//                         updatedSelected[idx] = !updatedSelected[idx];
//                         return updatedSelected;
//                       });
//                     }}
//                     onDeleteEpisode={handleDeleteEpisode}
//                   />
//                 ))}
//                 <Col className="absolute right-0 top-0 overflow-hidden h-full">
//                   <Button
//                     onClick={() => {
//                       handleReorderButtonClick(true);
//                     }}
//                     className="h-full rounded-none bg-gray-text"
//                   >
//                     <IconUpArrow className="fill-white" />
//                   </Button>
//                   <hr className="border-black" />
//                   <Button
//                     onClick={() => {
//                       handleReorderButtonClick(false);
//                     }}
//                     className="h-full rounded-none bg-gray-text"
//                   >
//                     <IconDownArrow className="fill-white" />
//                   </Button>
//                 </Col>
//               </Col>
//             </Row>
//           ) : (
//             <Label
//               htmlFor="episodes"
//               className="flex flex-col justify-center items-center bg-gray-darker rounded-sm overflow-hidden cursor-pointer w-full h-[340px]"
//             >
//               <IconUpload className="fill-gray-text " />
//               <Gap y={3} />
//               <Text className="text-[12pt] text-gray-text">
//                 {t("dragDesc")}
//               </Text>
//             </Label>
//           )}
//         </Col>
//         <Gap y={4} />
//         <Row className="justify-between">
//           <Button
//             onClick={handleUploadImageClick}
//             className="bg-gray-text text-white"
//           >
//             {t("imageUpload")}
//           </Button>
//           <Button
//             onClick={handleOpenEpisodeImageClick}
//             className="bg-mint text-white"
//           >
//             {t("episodePreview")}
//           </Button>
//         </Row>
//         <ul className="list-disc p-5 text-gray-text">
//           <li>{t("noteDesc1")}</li>
//           <li>{t("noteDesc2")}</li>
//         </ul>
//
//         <Input
//           className="invisible h-0"
//           ref={inputRef}
//           id="episodes"
//           multiple
//           type="file"
//           accept=".png, .jpg, .jpeg"
//           onChange={handleInputImageChange}
//         />
//       </>
//     );
//   }
//
//   return (
//     <Col>
//       {/* <Label htmlFor="title">{t("episodeTitle")}</Label>
//       <Gap y={3} />
//       <Input
//         className="text-black"
//         id="title"
//         value={title}
//         onChange={handleTitleChange}
//         placeholder={t("episodeTitlePlaceholder")}
//       />
//       <Gap y={4} />
//
//       <Label htmlFor="title">{t("episodeEnTitle")}</Label>
//       <Gap y={3} />
//       <Input
//         className="text-black"
//         id="title"
//         value={title_en}
//         onChange={handleEnTitleChange}
//         placeholder={t("episodeEnTitlePlaceholder")}
//       />
//       <Gap y={10} /> */}
//
//       <Row>
//         <Label htmlFor="title">{t("episodeNumber")}</Label>
//         <Gap x={2} />
//         <Text className="text-mint text-[10pt]">{locale === "ko" ? "*필수" : "*Required"}</Text>
//       </Row>
//       <Gap y={3} />
//       <Input
//         className="text-black [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//         id="title"
//         value={episodeNo}
//         type="number"
//         onChange={handleEpisodeNumberChange}
//         onKeyDown={preventLetters}
//         placeholder={t("episodeNumberPlaceholder")}
//       />
//       <Gap y={10} />
//
//       {renderWebtoonImageList()}
//       <Gap y={4} />
//       <Row className="justify-end">
//         <Button
//           disabled={submitDisabled}
//           onClick={handleSubmit}
//           className="rounded-full bg-mint text-white"
//         >
//           {isSubmitting ? "processing.." : `${t("register")}`}
//           <Gap x={2} />
//           <IconRightBrackets className="fill-white" />
//         </Button>
//       </Row>
//       <Gap y={40} />
//     </Col>
//   );
// }
