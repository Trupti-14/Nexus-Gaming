const scoreText = document.getElementById("scoreText");
const percentageText = document.getElementById("percentageText");
const starsBox = document.getElementById("starsBox");
const reviewBox = document.getElementById("reviewBox");

const score = Number(localStorage.getItem("englishQuizScore")) || 0;
const percentage = Number(localStorage.getItem("englishQuizPercentage")) || 0;
const total = Number(localStorage.getItem("englishQuizTotal")) || 5;

scoreText.textContent = `${score} / ${total}`;
percentageText.textContent = `${percentage}%`;

if (percentage >= 90) {
  starsBox.textContent = "⭐⭐⭐⭐⭐";
  reviewBox.textContent = "Outstanding! Your English understanding is excellent. Keep shining!";
} else if (percentage >= 70) {
  starsBox.textContent = "⭐⭐⭐⭐";
  reviewBox.textContent = "Very good work! You understood most concepts well.";
} else if (percentage >= 50) {
  starsBox.textContent = "⭐⭐⭐";
  reviewBox.textContent = "Nice effort! Practice a bit more to improve your score.";
} else if (percentage >= 30) {
  starsBox.textContent = "⭐⭐";
  reviewBox.textContent = "Good try! Rewatch the lesson and practice again.";
} else {
  starsBox.textContent = "⭐";
  reviewBox.textContent = "Keep going! Learn again and retry the quiz.";
}