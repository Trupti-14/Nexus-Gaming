const chapterTitle = document.getElementById("chapterTitle");
const chapterSubtitle = document.getElementById("chapterSubtitle");
const summaryText = document.getElementById("summaryText");
const summaryPoints = document.getElementById("summaryPoints");
const videoFrame = document.getElementById("chapterVideo");
const markCompleteBtn = document.getElementById("markCompleteBtn");

const englishChapters = {
  "Alphabet & Phonics": {
    subtitle: "Learn letters, sounds, and simple phonics patterns.",
    summary: "This chapter helps children identify alphabet letters and connect them with basic phonics sounds.",
    points: [
      "Learn uppercase and lowercase letters",
      "Repeat sounds after listening carefully",
      "Match letters with everyday objects"
    ],
    video: "https://www.youtube.com/embed/lGm6TcXr7b0"
  },
  "Sight Words": {
    subtitle: "Recognize common words quickly for fluent reading.",
    summary: "Children practice common words that appear often in reading and speaking.",
    points: [
      "Recognize important daily-use words",
      "Practice reading without spelling each letter",
      "Improve reading speed and confidence"
    ],
    video: "https://www.youtube.com/embed/8Gz5fKZ7brQ"
  },
  "Vocabulary Building": {
    subtitle: "Learn words, meanings, and picture matching.",
    summary: "This chapter introduces new words through images, examples, and fun activities.",
    points: [
      "Connect words with images",
      "Understand meaning through examples",
      "Use new words in speaking practice"
    ],
    video: "https://www.youtube.com/embed/U8hYbA5P4bU"
  },
  "Sentence Making": {
    subtitle: "Arrange words correctly and form complete sentences.",
    summary: "Children learn how to build simple and meaningful sentences using correct word order.",
    points: [
      "Arrange words in the correct order",
      "Use naming words and action words",
      "Read simple complete sentences aloud"
    ],
    video: "https://www.youtube.com/embed/VLOCsoUI0Is"
  }
};

const currentChapter = localStorage.getItem("englishCurrentChapter") || "Alphabet & Phonics";
const chapterData = englishChapters[currentChapter];

chapterTitle.textContent = currentChapter;
chapterSubtitle.textContent = chapterData.subtitle;
summaryText.textContent = chapterData.summary;
videoFrame.src = chapterData.video;

summaryPoints.innerHTML = "";
chapterData.points.forEach((point) => {
  const li = document.createElement("li");
  li.textContent = point;
  summaryPoints.appendChild(li);
});

markCompleteBtn.addEventListener("click", () => {
  alert(`${currentChapter} marked as completed!`);
});