async function loadYouTube() {
  const track = document.querySelector("#ytTrack");
  if (!track) return;

  const res = await fetch("/api/youtube.json");
  const data = await res.json();

  track.innerHTML = (data.items ?? []).map(video => `
    <a class="video" href="${video.url}" target="_blank" rel="noopener">
      <img src="${video.thumbnail}" alt="${video.title}">
    </a>
  `).join("");
}

loadYouTube();