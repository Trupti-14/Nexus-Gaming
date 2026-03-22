const optionButtons = document.querySelectorAll(".option-btn");
const resultText = document.getElementById("resultText");
const wordButtons = document.querySelectorAll(".word-btn");
const sentenceOutput = document.getElementById("sentenceOutput");
const checkSentenceBtn = document.getElementById("checkSentenceBtn");
const sentenceResult = document.getElementById("sentenceResult");

optionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    optionButtons.forEach((b) => b.classList.remove("correct", "wrong"));

    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
      resultText.textContent = "Great job! Apple is the correct answer. ⭐";
      resultText.style.color = "#49f5a6";
    } else {
      btn.classList.add("wrong");
      resultText.textContent = "Oops! Try again carefully.";
      resultText.style.color = "#ff7abf";
    }
  });
});

let builtSentence = [];

wordButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    builtSentence.push(btn.textContent);
    sentenceOutput.textContent = builtSentence.join(" ");
    btn.disabled = true;
    btn.style.opacity = "0.55";
  });
});

checkSentenceBtn.addEventListener("click", () => {
  const finalSentence = builtSentence.join(" ");
  if (finalSentence === "This is a cat") {
    sentenceResult.textContent = "Perfect! You built the sentence correctly. ✅";
    sentenceResult.style.color = "#49f5a6";
  } else {
    sentenceResult.textContent = "Not correct yet. Reset and try once more.";
    sentenceResult.style.color = "#ff7abf";
  }
});