const result = JSON.parse(localStorage.getItem("quizResult")) || {
  score: 0,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  skipped: 0,
  status: "Needs Improvement",
  chapter: "Addition Basics"
};

document.getElementById("finalScore").textContent = result.score;
document.getElementById("accuracy").textContent = `${result.accuracy}%`;
document.getElementById("correctAns").textContent = result.correct;
document.getElementById("incorrectAns").textContent = result.incorrect;
document.getElementById("skippedAns").textContent = result.skipped;
document.getElementById("status").textContent = result.status;

const feedbackText = document.getElementById("feedbackText");
const nextChapter = document.getElementById("nextChapter");

if (result.accuracy >= 80) {
  feedbackText.textContent = "Excellent work! You understood the concept really well.";
  nextChapter.textContent = "Subtraction Fun";
} else if (result.accuracy >= 50) {
  feedbackText.textContent = "Good effort! Practice once more to make your understanding stronger.";
  nextChapter.textContent = "Addition Revision";
} else {
  feedbackText.textContent = "Keep going! Rewatch the concept video and try the practice game again.";
  nextChapter.textContent = "Addition Basics";
}