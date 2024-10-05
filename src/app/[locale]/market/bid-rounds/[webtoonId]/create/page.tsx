import { CreateBidRoundPage } from "@/$pages/creators/CreateBidRoundPage";
import { cookies } from "next/headers";
import * as WebtoonApi from "@/apis/webtoons";
import { tokenHolder } from "@/system/token_holder";
import { ErrorComponent } from "@/components/ErrorComponent";

export default async function CreateSubmit({ params }: { params: { webtoonId: string } }) {
  try {
    const { data: webtoon } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return WebtoonApi.get(parseInt(params.webtoonId), { $myLike: true });
    });

    return (
      <div className="bg-[#121212] min-h-screen">
        <CreateBidRoundPage webtoon={webtoon} />
      </div>
    );
  } catch (e){
    console.log(e);
    return (
      <ErrorComponent />
    );
  }
}
