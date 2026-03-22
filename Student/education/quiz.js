const chapterInfo = JSON.parse(localStorage.getItem("selectedChapter")) || { title: "Addition Basics" };
document.getElementById("quizChapterName").textContent = `Subject / Chapter: ${chapterInfo.title}`;

const quizQuestions = [
  {
    question: "What is 2 + 2 ?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  },
  {
    question: "What is 5 + 1 ?",
    options: ["6", "7", "4", "8"],
    answer: "6"
  },
  {
    question: "What is 3 + 3 ?",
    options: ["5", "7", "6", "4"],
    answer: "6"
  }
];

let currentIndex = 0;
let answers = new Array(quizQuestions.length).fill(null);
let timeLeft = 60;

const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const questionIndicator = document.getElementById("questionIndicator");
const totalQ = document.getElementById("totalQ");
const attemptedQ = document.getElementById("attemptedQ");
const remainingQ = document.getElementById("remainingQ");
const timerEl = document.getElementById("timer");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

totalQ.textContent = quizQuestions.length;

function renderQuestion() {
  const item = quizQuestions[currentIndex];
  questionText.textContent = item.question;
  questionIndicator.textContent = `Question ${currentIndex + 1} / ${quizQuestions.length}`;
  optionsBox.innerHTML = "";

  item.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;

    if (answers[currentIndex] === option) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      answers[currentIndex] = option;
      updateInfo();
      renderQuestion();
    });

    optionsBox.appendChild(btn);
  });
}

function updateInfo() {
  const attempted = answers.filter(ans => ans !== null).length;
  attemptedQ.textContent = attempted;
  remainingQ.textContent = quizQuestions.length - attempted;
}

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < quizQuestions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
});

function submitQuiz() {
  let correct = 0;
  let incorrect = 0;
  let skipped = 0;

  quizQuestions.forEach((q, i) => {
    if (answers[i] === null) {
      skipped++;
    } else if (answers[i] === q.answer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  const score = correct * 10;
  const attempted = correct + incorrect;
  const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
  const status = score >= 20 ? "Pass" : "Needs Improvement";

  localStorage.setItem("quizResult", JSON.stringify({
    score,
    accuracy,
    correct,
    incorrect,
    skipped,
    status,
    chapter: chapterInfo.title
  }));

  window.location.href = "result.html";
}

submitBtn.addEventListener("click", submitQuiz);

const timer = setInterval(() => {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;

  if (timeLeft <= 0) {
    clearInterval(timer);
    submitQuiz();
  }

  timeLeft--;
}, 1000);

renderQuestion();
updateInfo();