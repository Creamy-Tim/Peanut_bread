import type { APIRoute } from "astro";

// https://vercel.com/creamy-tims-projects/ddang_cong0
// 이 링크에서 API 키값 관리
// (링크는 배포 관련 사이트)
const API_KEY = import.meta.env.YOUTUBE_API_KEY as string | undefined;

// ✅ 특정 재생목록 ID (예: "PLxxxx...")
// 여러 재생목록을 쓰고 싶으면 "A,B,C" 형태로 넣을 수 있게 만들어둠.
const PLAYLIST_IDS_RAW = import.meta.env.YOUTUBE_PLAYLIST_IDS as string | undefined;

const MAX_RESULTS = 4;
const CACHE_SECONDS = 60 * 10; // 10분 캐시

export const GET: APIRoute = async () => {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!PLAYLIST_IDS_RAW) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_PLAYLIST_IDS" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const playlistIds = PLAYLIST_IDS_RAW
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (playlistIds.length === 0) {
    return new Response(JSON.stringify({ error: "YOUTUBE_PLAYLIST_IDS is empty" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1) 재생목록의 최신(상단) 4개 가져오기
  // ⚠️ 주의: "최근"의 기준은 "그 재생목록에 정렬된 순서"야.
  // 재생목록이 오래된 순/수동 정렬이면 그 순서대로 나옴.
  const allItems: any[] = [];

  for (const playlistId of playlistIds) {
    const url =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      `?part=snippet,contentDetails` +
      `&playlistId=${encodeURIComponent(playlistId)}` +
      `&maxResults=${MAX_RESULTS}` +
      `&key=${encodeURIComponent(API_KEY)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        JSON.stringify({
          error: "YouTube API error (playlistItems)",
          playlistId,
          detail: text,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await res.json();
    const items = data.items ?? [];

    for (const it of items) {
      const sn = it.snippet ?? {};
      const cd = it.contentDetails ?? {};
      const videoId = sn?.resourceId?.videoId ?? "";

      // ✅ 레터박스 적은 썸네일을 직접 생성
      const thumb = videoId
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : "";

      allItems.push({
        id: videoId,
        title: sn.title ?? "",
        // playlistItems.contentDetails.videoPublishedAt가 있으면 그걸 사용
        publishedAt: cd.videoPublishedAt ?? sn.publishedAt ?? "",
        thumbnail: thumb,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : "",
        playlistId,
      });
    }
  }

  return new Response(JSON.stringify({ items: allItems }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // ✅ Vercel CDN 캐시: 방문자가 많아도 API 호출 폭증을 막아줌
      "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
};