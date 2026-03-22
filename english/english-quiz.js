const questions = [
  {
    question: "Which word matches the picture of an apple?",
    options: ["Apple", "Book", "Ball", "Dog"],
    answer: "Apple"
  },
  {
    question: "Which letter comes after B?",
    options: ["D", "C", "A", "E"],
    answer: "C"
  },
  {
    question: "Choose the correct sight word:",
    options: ["the", "tah", "tha", "hte"],
    answer: "the"
  },
  {
    question: "Which sentence is correct?",
    options: ["Cat is this a", "This is a cat", "A this is cat", "Is cat this a"],
    answer: "This is a cat"
  },
  {
    question: "Which word means a place where we read books?",
    options: ["Library", "Garden", "Market", "Bridge"],
    answer: "Library"
  }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionList = document.getElementById("optionList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

function renderQuestion() {
  const q = questions[currentQuestion];
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  questionText.textContent = q.question;
  optionList.innerHTML = "";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-item";
    btn.textContent = option;

    if (userAnswers[currentQuestion] === option) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => {
      userAnswers[currentQuestion] = option;
      renderQuestion();
    });

    optionList.appendChild(btn);
  });
}

nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

submitBtn.addEventListener("click", () => {
  let score = 0;

  questions.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  localStorage.setItem("englishQuizScore", score);
  localStorage.setItem("englishQuizPercentage", percentage);
  localStorage.setItem("englishQuizTotal", questions.length);

  window.location.href = "english-feedback.html";
});

renderQuestion();