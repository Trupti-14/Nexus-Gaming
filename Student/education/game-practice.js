const selectedChapter = JSON.parse(localStorage.getItem("selectedChapter")) || { title: "Addition Basics" };
document.getElementById("gameChapterName").textContent = `Chapter: ${selectedChapter.title}`;

const gameQuestions = [
  { q: "What is 4 + 3 ?", options: [6, 7, 8], answer: 7 },
  { q: "What is 5 + 2 ?", options: [7, 9, 6], answer: 7 },
  { q: "What is 3 + 1 ?", options: [5, 4, 2], answer: 4 }
];

let current = 0;
let score = 0;
let stars = 0;
let attempts = 0;
let correct = 0;

const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const gameMessage = document.getElementById("gameMessage");
const scoreEl = document.getElementById("score");
const starsEl = document.getElementById("stars");
const accuracyEl = document.getElementById("accuracy");
const roundEl = document.getElementById("round");
const retryBtn = document.getElementById("retryBtn");

function renderQuestion() {
  const currentQ = gameQuestions[current];
  questionText.textContent = currentQ.q;
  roundEl.textContent = `${current + 1} / ${gameQuestions.length}`;
  optionsBox.innerHTML = "";

  currentQ.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(option));
    optionsBox.appendChild(btn);
  });
}

function updateStats() {
  scoreEl.textContent = score;
  starsEl.textContent = stars;
  const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
  accuracyEl.textContent = `${accuracy}%`;

  localStorage.setItem("gameResult", JSON.stringify({
    score,
    stars,
    accuracy
  }));
}

function checkAnswer(selected) {
  const currentQ = gameQuestions[current];
  attempts++;

  if (selected === currentQ.answer) {
    score += 10;
    stars += 1;
    correct++;
    gameMessage.textContent = "✅ Correct answer! Great job!";
  } else {
    gameMessage.textContent = "❌ Oops! Try the next one.";
  }

  updateStats();

  if (current < gameQuestions.length - 1) {
    current++;
    setTimeout(() => {
      gameMessage.textContent = "";
      renderQuestion();
    }, 700);
  } else {
    gameMessage.textContent = "🎉 Practice completed!";
  }
}

retryBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  stars = 0;
  attempts = 0;
  correct = 0;
  gameMessage.textContent = "";
  updateStats();
  renderQuestion();
});

renderQuestion();
updateStats();