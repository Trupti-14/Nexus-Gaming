const topicData = {
  "Internet Safety": {
    title: "Internet Safety",
    description: "Learn how to use the internet safely and make smart choices online.",
    duration: "🎥 4 Minutes",
    progress: 60,
    summary: "This topic helps students understand safe online behavior, protecting passwords, and avoiding strangers on the internet.",
    points: [
      "Never share your password with anyone except parents or trusted adults.",
      "Do not click unknown links or download random files.",
      "Tell a trusted adult if someone online makes you uncomfortable.",
      "Use the internet for learning, fun, and safe communication only."
    ],
    videoUrl: "https://www.youtube.com/embed/HxySrSbSY7o"
  },
  "Road Safety": {
    title: "Road Safety",
    description: "Learn traffic basics, zebra crossing use, and safe movement on roads.",
    duration: "🎥 3 Minutes",
    progress: 100,
    summary: "This topic teaches students how to stay careful while walking, crossing, and travelling on roads.",
    points: [
      "Always cross at the zebra crossing.",
      "Look left and right before crossing.",
      "Follow traffic light signals.",
      "Walk with adults in busy areas."
    ],
    videoUrl: "https://www.youtube.com/embed/HxySrSbSY7o"
  }
};

const params = new URLSearchParams(window.location.search);
const topicName = params.get("topic") || "Internet Safety";
const currentTopic = topicData[topicName] || topicData["Internet Safety"];

document.getElementById("videoTopicTitle").textContent = currentTopic.title;
document.getElementById("videoTopicDesc").textContent = currentTopic.description;
document.getElementById("videoDuration").textContent = currentTopic.duration;
document.getElementById("videoProgressText").textContent = `${currentTopic.progress}%`;
document.getElementById("completionLabel").textContent = `${currentTopic.progress}%`;
document.getElementById("videoProgressFill").style.width = `${currentTopic.progress}%`;
document.getElementById("topicSummary").textContent = currentTopic.summary;
document.getElementById("videoFrame").src = currentTopic.videoUrl;
document.getElementById("startQuizBtn").href = `../awareness-quiz/awareness-quiz.html?topic=${encodeURIComponent(currentTopic.title)}`;

const keyPointsList = document.getElementById("keyPointsList");
currentTopic.points.forEach(point => {
  const item = document.createElement("div");
  item.className = "point-item";
  item.textContent = `✅ ${point}`;
  keyPointsList.appendChild(item);
});

document.getElementById("markCompleteBtn").addEventListener("click", () => {
  document.getElementById("videoProgressText").textContent = "100%";
  document.getElementById("completionLabel").textContent = "100%";
  document.getElementById("videoProgressFill").style.width = "100%";
  document.getElementById("statusText").textContent = "Completed";
  alert("Topic marked as completed successfully!");
});

document.getElementById("playBtn").addEventListener("click", () => {
  alert("Video play action triggered.");
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  alert("Video pause action triggered.");
});