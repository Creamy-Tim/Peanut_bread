fetch("/api/youtube.json")
  .then((res) => res.json())
  .then((data) => {
    const track = document.querySelector(".video_section_track");
    if (!track) return;

    track.innerHTML = "";

    (data.items || []).forEach((video) => {
      const a = document.createElement("a");
      a.href = video.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "card";

      a.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="card_title">${video.title}</div>
      `;

      track.appendChild(a);
    });
  })
  .catch((err) => console.error("Failed to load youtube.json", err));
