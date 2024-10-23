// "use client";
//
// import { useAdmin } from "@/states/UserState";
// import { Col } from "@/ui/layouts";
// import { useLocale } from "next-intl";
//
// type EpisodeDetailProps = {
//   webtoon: WebtoonT;
//   episode: WebtoonEpisodeT;
// };
//
// export function DownloadEpisodeImage({ webtoon, episode }: EpisodeDetailProps) {
//   const admin = useAdmin();
//   const locale = useLocale();
//
//   return (
//     admin ?
//       <Col className="w-full rounded-sm bg-gray-darker px-5 py-2">
//         {episode.images?.map((item, idx) =>
//           <span key={item.episodeId} className="my-1 text-[8pt]">
//             {`${locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}_${episode.title}_${idx + 1}.jpeg`}
//             <button
//               className="bg-mint rounded-sm px-1 ml-2"
//               onClick={() => { downloadImage(`${item.path}`, `${locale === "ko" ? webtoon.title : webtoon.title_en ?? webtoon.title}_${episode.title}_${idx + 1}.jpeg`); }}
//             >
//               다운로드
//             </button>
//           </span>
//         )}
//       </Col>
//       : null
//   );
// }
//
// async function downloadImage(url: string, filename: string): Promise<void> {
//   try {
//     const rsp = await AdminApi.loadMedia({ key: url });
//     const a = document.createElement("a");
//     a.style.display = "none";
//     a.href = `${rsp.data}`;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   } catch (e){
//     alert("이미지 다운로드에 실패했습니다.");
//   }
// }