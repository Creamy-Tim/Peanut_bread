const slides = Array.from(document.querySelectorAll(".slider_slide"));
const dots = Array.from(document.querySelectorAll(".slider_dot"));
const prevBtn = document.querySelector(".slider_prev");
const nextBtn = document.querySelector(".slider_next");

let current = 0;

function goTo(index) {
  slides[current].classList.remove("is-active");
  dots[current].classList.remove("is-active");

  // 🔥 음수 → 마지막 슬라이드로 자동 이동
  current = (index + slides.length) % slides.length;

  slides[current].classList.add("is-active");
  dots[current].classList.add("is-active");
}

// 좌우 버튼
prevBtn?.addEventListener("click", () => goTo(current - 1));
nextBtn?.addEventListener("click", () => goTo(current + 1));

// 도트 클릭 이동
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => goTo(i));
});
