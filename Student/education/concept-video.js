const chapter = JSON.parse(localStorage.getItem("selectedChapter")) || {
  title: "Addition Basics",
  desc: "Learn how to add numbers using objects and pictures.",
  progress: 72
};

document.getElementById("chapterTitle").textContent = chapter.title;
document.getElementById("chapterSubtext").textContent = chapter.desc;
document.getElementById("topicProgressText").textContent = `${chapter.progress || 72}%`;
document.getElementById("topicProgressFill").style.width = `${chapter.progress || 72}%`;

const summaryMap = {
  "Addition Basics": {
    text: "Addition means putting things together to find the total.",
    points: [
      "Use objects and pictures for understanding",
      "Count carefully one by one",
      "Practice with small numbers first"
    ],
    video: "https://www.youtube.com/embed/hCXeH9j-z8I"
  },
  "Subtraction Fun": {
    text: "Subtraction means taking away from a group.",
    points: [
      "Start from the total number",
      "Remove the required amount",
      "Count what remains"
    ],
    video: "https://www.youtube.com/embed/2M7Rk3fD8Q0"
  }
};

const summaryText = document.getElementById("summaryText");
const summaryList = document.getElementById("summaryList");
const videoFrame = document.getElementById("videoFrame");

if (summaryMap[chapter.title]) {
  const data = summaryMap[chapter.title];
  summaryText.textContent = data.text;
  summaryList.innerHTML = data.points.map(point => `<li>${point}</li>`).join("");
  videoFrame.src = data.video;
}

document.getElementById("markCompleteBtn").addEventListener("click", () => {
  alert(`${chapter.title} marked as completed!`);
});