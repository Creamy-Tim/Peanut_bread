const bookModal = document.getElementById("bookModal");
const bookImg = document.getElementById("bookImg");
const bookNameEl = document.getElementById("bookName");
const bookWriterEl = document.getElementById("bookWriter");
const bookPagesEl = document.getElementById("bookPages");
const bookIntroduceEl = document.getElementById("bookIntroduce");
const bookPriceEl = document.getElementById("bookPrice");
const bookLinkEl = document.getElementById("bookLink");

function openBookModal(data) {
  // 이미지
  if (data.img) {
    bookImg.src = data.img;
    bookImg.alt = data.name || "";
    bookImg.style.display = "";
  } else {
    bookImg.removeAttribute("src");
    bookImg.alt = "";
    bookImg.style.display = "none";
  }

  // 텍스트
  bookNameEl.textContent = data.name || "";
  bookWriterEl.textContent = data.writer || "";
  bookPagesEl.textContent = data.pages || "";
  bookIntroduceEl.textContent = data.introduce || "";
  bookPriceEl.textContent = data.price || "";

  // 텍스트/링크 유무에 따라 렌더링 (memberModal renderItem 스타일)
  function renderLinkItem(el, { text, link }) {
    // 텍스트 없으면 숨김
    if (!text) {
      el.style.display = "none";
      el.removeAttribute("href");
      el.classList.remove("is-link");
      return;
    }

    // 텍스트 있으면 보이기
    el.style.display = "";
    el.textContent = text;

    // 링크 있으면 링크로
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

  // 구매하러가기 버튼 처리
  renderLinkItem(bookLinkEl, {
    text: "구매하러가기",
    link: data.link, // data-link 값을 사용
  });

  // 모달 열기
  bookModal.classList.add("open");
  bookModal.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
}

function closeBookModal() {
  bookModal.classList.remove("open");
  bookModal.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
}

document.addEventListener("click", (e) => {
  // 🔥 book 카드(또는 버튼) 클래스 이름을 .book 으로 가정
  const book = e.target.closest(".book");
  if (book) {
    openBookModal({
      img: book.dataset.img,
      name: book.dataset.name,
      writer: book.dataset.writer,
      pages: book.dataset.pages,
      introduce: book.dataset.introduce,
      price: book.dataset.price,
      link: book.dataset.link,
    });
  }

  // 오버레이/닫기 버튼 등 data-close="true" 클릭 시 닫기
  if (e.target.closest("[data-close='true']")) closeBookModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && bookModal.classList.contains("open")) {
    closeBookModal();
  }
});
