import type { APIRoute } from "astro";

// https://vercel.com/creamy-tims-projects/ddang_cong0
// 이 링크에서 API 키값 관리
// (링크는 배포 관련 사이트)
const API_KEY = import.meta.env.YOUTUBE_API_KEY;
const CHANNEL_IDS_RAW = import.meta.env.YOUTUBE_CHANNEL_IDS;
const MAX_RESULTS = 4;
const CACHE_SECONDS = 60 * 10;

export const GET: APIRoute = async () => {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_API_KEY" }), { status: 500 });
  }
  if (!CHANNEL_IDS_RAW) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_CHANNEL_IDS" }), { status: 500 });
  }

  const channelIds = CHANNEL_IDS_RAW.split(",").map((s) => s.trim()).filter(Boolean);

  const fetchOne = async (channelId: string) => {
    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      `?part=snippet&channelId=${encodeURIComponent(channelId)}` +
      `&maxResults=${MAX_RESULTS}` +
      `&order=date&type=video` +
      `&key=${encodeURIComponent(API_KEY)}`;

    const res = await fetch(url);
    if (!res.ok) {
      const detail = await res.text();
      return { channelId, error: "YouTube API error", detail };
    }

    const data = await res.json();

    const items = (data.items ?? []).map((it: any) => {
      const videoId = it.id?.videoId;
      const sn = it.snippet ?? {};
      const thumb =
        sn.thumbnails?.high?.url ||
        sn.thumbnails?.medium?.url ||
        sn.thumbnails?.default?.url ||
        "";

      return {
        id: videoId ?? "",
        title: sn.title ?? "",
        publishedAt: sn.publishedAt ?? "",
        thumbnail: thumb,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : "",
      };
    });

    return { channelId, items };
  };

  const results = await Promise.all(channelIds.map(fetchOne));

  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
};
