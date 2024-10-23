import { UpdateBidRoundPage } from "@/$pages/creators/UpdateBidRoundPage";
import { cookies } from "next/headers";
import { tokenHolder } from "@/system/token_holder";
import { ErrorComponent } from "@/components/ErrorComponent";

export default async function UpdateSubmit({ params }: { params: { webtoonId: string } }) {
  try {
    const { data: webtoon } = await tokenHolder.serverFetchWithCredential(cookies, async () => {
      return WebtoonApi.get(parseInt(params.webtoonId), { $myLike: true, $bidRounds: true });
    });

    return (
      <div className="bg-[#121212] min-h-screen">
        <UpdateBidRoundPage webtoon={webtoon} />
      </div>
    );
  } catch (e){
    console.log(e);
    return (
      <ErrorComponent />
    );
  }
}
