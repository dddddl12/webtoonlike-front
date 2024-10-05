import { CreateWebtoonEpisodePage } from "@/$pages/creators/CreateWebtoonEpisodePage";

export default function CreateWebtoonPost({ params } : {params: {webtoonId: string}} ) {
  return (
    <div className="bg-[#121212] min-h-screen">
      <CreateWebtoonEpisodePage webtoonId={parseInt(params.webtoonId)} />
    </div>
  );
}
