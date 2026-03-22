const quizData = [
  {
    type: "MCQ",
    question: "What should you do if someone online asks for your password?",
    options: [
      "Share it quickly",
      "Ignore and tell a trusted adult",
      "Post it in chat",
      "Send it later"
    ],
    correct: 1
  },
  {
    type: "Scenario",
    scenario: "You get a message from an unknown person saying, 'Click this link to win a prize.'",
    question: "What is the safest thing to do?",
    options: [
      "Click the link fast",
      "Forward it to friends",
      "Ignore it and tell a trusted adult",
      "Reply with your name"
    ],
    correct: 2
  },
  {
    type: "MCQ",
    question: "Which of these is a strong online safety rule?",
    options: [
      "Share personal details with strangers",
      "Keep passwords private",
      "Trust every message",
      "Open every file"
    ],
    correct: 1
  },
  {
    type: "Scenario",
    scenario: "A game asks for your home address before allowing you to continue.",
    question: "What should you do?",
    options: [
      "Enter the address",
      "Ask a trusted adult first",
      "Use a random address",
      "Send school details too"
    ],
    correct: 1
  },
  {
    type: "MCQ",
    question: "Who should you talk to if something online makes you uncomfortable?",
    options: [
      "A trusted adult",
      "A random stranger",
      "Nobody",
      "Only internet friends"
    ],
    correct: 0
  }
];

let currentQuestion = 0;
let answers = new Array(quizData.length).fill(null);
let timeLeft = 120;

const questionIndicator = document.getElementById("questionIndicator");
const timer = document.getElementById("timer");
const quizProgressFill = document.getElementById("quizProgressFill");
const questionType = document.getElementById("questionType");
const questionText = document.getElementById("questionText");
const scenarioBox = document.getElementById("scenarioBox");
const scenarioText = document.getElementById("scenarioText");
const optionsList = document.getElementById("optionsList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const answeredCount = document.getElementById("answeredCount");
const remainingCount = document.getElementById("remainingCount");
const currentScore = document.getElementById("currentScore");
const questionNavGrid = document.getElementById("questionNavGrid");
const resultOverlay = document.getElementById("resultOverlay");
const finalScoreText = document.getElementById("finalScoreText");
const finalPercentText = document.getElementById("finalPercentText");
const starRating = document.getElementById("starRating");
const teacherReviewText = document.getElementById("teacherReviewText");
const retryBtn = document.getElementById("retryBtn");
const quizTopicTitle = document.getElementById("quizTopicTitle");

const params = new URLSearchParams(window.location.search);
const topicName = params.get("topic") || "Internet Safety";
quizTopicTitle.textContent = `${topicName} & Smart Choices`;

function renderNavigator() {
  questionNavGrid.innerHTML = "";
  quizData.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.className = "q-nav-btn";

    if (index === currentQuestion) btn.classList.add("active");
    if (answers[index] !== null) btn.classList.add("answered");

    btn.textContent = index + 1;
    btn.addEventListener("click", () => {
      currentQuestion = index;
      renderQuestion();
    });

    questionNavGrid.appendChild(btn);
  });
}

function renderQuestion() {
  const q = quizData[currentQuestion];

  questionIndicator.textContent = `Question ${currentQuestion + 1} / ${quizData.length}`;
  questionType.textContent = q.type;
  questionText.textContent = q.question;
  quizProgressFill.style.width = `${((currentQuestion + 1) / quizData.length) * 100}%`;

  if (q.scenario) {
    scenarioBox.classList.remove("hidden");
    scenarioText.textContent = q.scenario;
  } else {
    scenarioBox.classList.add("hidden");
  }

  optionsList.innerHTML = "";

  q.options.forEach((option, index) => {
    const item = document.createElement("div");
    item.className = "option-item";

    if (answers[currentQuestion] === index) {
      item.classList.add("selected");
    }

    item.innerHTML = `
      <div class="option-marker">${String.fromCharCode(65 + index)}</div>
      <div class="option-content">
        <h4>${option}</h4>
        <p>Select this answer if you think it is correct.</p>
      </div>
    `;

    item.addEventListener("click", () => {
      answers[currentQuestion] = index;
      updateStats();
      renderQuestion();
    });

    optionsList.appendChild(item);
  });

  prevBtn.disabled = currentQuestion === 0;

  if (currentQuestion === quizData.length - 1) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }

  renderNavigator();
  updateStats();
}

function updateStats() {
  const answered = answers.filter(answer => answer !== null).length;
  const remaining = quizData.length - answered;
  const score = answers.reduce((total, answer, index) => {
    return total + (answer === quizData[index].correct ? 1 : 0);
  }, 0);

  answeredCount.textContent = answered;
  remainingCount.textContent = remaining;
  currentScore.textContent = score;
  renderNavigator();
}

function submitQuiz() {
  let score = 0;
  quizData.forEach((q, index) => {
    if (answers[index] === q.correct) score++;
  });

  const percent = Math.round((score / quizData.length) * 100);
  finalScoreText.textContent = `${score}/${quizData.length}`;
  finalPercentText.textContent = `${percent}%`;

  if (percent >= 90) {
    starRating.textContent = "★★★★★";
    teacherReviewText.textContent = "Excellent work! You understand online safety very well.";
  } else if (percent >= 70) {
    starRating.textContent = "★★★★☆";
    teacherReviewText.textContent = "Great job! You made safe and smart choices.";
  } else if (percent >= 50) {
    starRating.textContent = "★★★☆☆";
    teacherReviewText.textContent = "Good effort. Revise the topic once more for better understanding.";
  } else {
    starRating.textContent = "★★☆☆☆";
    teacherReviewText.textContent = "Keep practicing. Review the topic again and try once more.";
  }

  resultOverlay.classList.remove("hidden");
}

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
});

submitBtn.addEventListener("click", submitQuiz);

retryBtn.addEventListener("click", () => {
  answers = new Array(quizData.length).fill(null);
  currentQuestion = 0;
  timeLeft = 120;
  resultOverlay.classList.add("hidden");
  renderQuestion();
});

function startTimer() {
  const timerInterval = setInterval(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");
    timer.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitQuiz();
      return;
    }

    timeLeft--;
  }, 1000);
}

renderQuestion();
startTimer();