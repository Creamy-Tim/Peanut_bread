document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("date");
  if (!el) return;

  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  el.textContent = `${year}년 ${month}월`;
});
