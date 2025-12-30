import type { APIRoute } from "astro";

const API_KEY = import.meta.env.YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.YOUTUBE_CHANNEL_ID;

const MAX_RESULTS = 4;
const CACHE_SECONDS = 60 * 10;

export const GET: APIRoute = async () => {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_API_KEY" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!CHANNEL_ID) {
    return new Response(JSON.stringify({ error: "Missing YOUTUBE_CHANNEL_ID" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet&channelId=${encodeURIComponent(CHANNEL_ID)}` +
    `&maxResults=${MAX_RESULTS}` +
    `&order=date&type=video` +
    `&key=${encodeURIComponent(API_KEY)}`;

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: "YouTube API error", detail: text }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
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

  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
};
