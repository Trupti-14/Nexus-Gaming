const chapterCards = document.querySelectorAll(".chapter-card");
const continueBtn = document.getElementById("continueBtn");

chapterCards.forEach((card) => {
  const btn = card.querySelector(".chapter-btn");

  btn.addEventListener("click", () => {
    const chapterName = card.dataset.chapter;
    localStorage.setItem("englishCurrentChapter", chapterName);
    window.location.href = "english-video.html";
  });
});

continueBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const savedChapter = localStorage.getItem("englishCurrentChapter") || "Alphabet & Phonics";
  localStorage.setItem("englishCurrentChapter", savedChapter);
  window.location.href = "english-video.html";
});