// 메인페이지 사이드바 햄버거 토글

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