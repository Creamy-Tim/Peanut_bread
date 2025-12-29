// 템플릿
// 사이드바 햄버거 토글

const menuBtn = document.querySelector('.header_btn');
const sidebar = document.querySelector('.sidebar');
const container = document.querySelector('.container');

const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

function openSidebar() {
    sidebar.classList.add('open');
    container.classList.add('menu-open');
    sidebar.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-label', '메뉴 닫기');
    menuBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    container.classList.remove('menu-open');
    sidebar.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-label', '메뉴 열기');
    menuBtn.setAttribute('aria-expanded', 'false');
}

function toggleSidebar() {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
}

// 초기 접근성 상태
sidebar.setAttribute('aria-hidden', 'true');
menuBtn.setAttribute('aria-expanded', 'false');

// 햄버거 버튼 클릭
menuBtn.addEventListener('click', toggleSidebar);

// ESC로 닫기
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    closeSidebar();
    }
});

// 메뉴 링크 클릭 시 닫기 (모바일에서만)
sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && isMobile()) closeSidebar();
});

// 화면 크기 변경 시 상태 정리
window.addEventListener('resize', () => {
    if (!isMobile()) {
    closeSidebar();
    }
});



// team.astro
// 작가 패널

const modal = document.getElementById("memberModal");
const img = document.getElementById("modalImg");
const nameEl = document.getElementById("modalName");
const roleEl = document.getElementById("modalRole");
const introduceEl = document.getElementById("modalIntroduce");
const showpieceEl = document.getElementById("modalShowpiece");
const instagramEl = document.getElementById("modalInstagram");
const emailEl = document.getElementById("modalEmail");

function openModal(data) {
    img.src = data.img;
    img.alt = data.name;
    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    introduceEl.textContent = data.introduce;

    // 텍스트, 링크 여부에 따라 요소 렌더링
    function renderItem(el, { label, text, link }) {
        // 텍스트 없으면 숨기기
        if (!text) {
            el.style.display = "none";
            return;
        }

        // 데이터 있으면 보이기
        el.style.display = "";

        // 라벨 붙이기 ("대표작 : ", "@")
        const content = label && text ? `${label}${text}` : text;

        if (content) {
            el.textContent = content;
        }

        if (link) {
            el.href = link;
            el.classList.add("is-link");
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener noreferrer");
        } else {
            el.removeAttribute("href");
            el.classList.remove("is-link");
        }
    }
    

    renderItem(showpieceEl, {
        label: "대표작 : ",
        text: data.showpiece,
        link: data.showpieceLink,
    });

    renderItem(instagramEl, {
        label: "@",
        text: data.instagram,
        link: data.instagramLink,
    });

    emailEl.textContent = data.email;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden"; // 스크롤 잠금
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = ""; // 복구
}

document.addEventListener("click", (e) => {
  const member = e.target.closest(".member");
  if (member) {
    openModal({
        img: member.dataset.img,
        name: member.dataset.name,
        role: member.dataset.role,
        introduce: member.dataset.introduce,
        showpiece: member.dataset.showpiece,
        showpieceLink: member.dataset.showpieceLink,
        instagram: member.dataset.instagram,
        instagramLink: member.dataset.instagramLink,
        email: member.dataset.email,
    });
  }

  if (e.target.closest("[data-close='true']")) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});
