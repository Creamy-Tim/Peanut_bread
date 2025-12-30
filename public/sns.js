fetch("/api/youtube.json")
    .then((res) => res.json())
    .then((data) => {
        const tracks = document.querySelectorAll(".video_section_track[data-playlist]");
        if (!tracks.length) return;

        // 트랙 초기화
        tracks.forEach((t) => (t.innerHTML = ""));

        const items = data.items || [];

        // playlistId별로 해당 트랙에 렌더
        tracks.forEach((track) => {
            const pid = track.dataset.playlist; // data-playlist 값
            const list = items.filter((v) => v.playlistId === pid);

            list.forEach((video) => {
                const a = document.createElement("a");
                a.href = video.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.className = "video";

                a.innerHTML = `
                <img
                src="${video.thumbnail}"
                alt="${video.title}"
                loading="lazy"
                onerror="this.onerror=null; this.src='https://i.ytimg.com/vi/${video.id}/hqdefault.jpg';"
                />
                `;

                track.appendChild(a);
            });
        });
    })
    .catch((err) => console.error("Failed to load youtube.json", err));