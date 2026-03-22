const topics = [
  {
    id: 1,
    icon: "💻",
    title: "Internet Safety",
    description: "Learn how to stay safe online, avoid strangers, and protect passwords.",
    level: "Easy",
    duration: "4 min video",
    quiz: "5 questions",
    progress: 60
  },
  {
    id: 2,
    icon: "🛣️",
    title: "Road Safety",
    description: "Understand traffic signals, zebra crossing, and safe walking habits.",
    level: "Easy",
    duration: "3 min video",
    quiz: "4 questions",
    progress: 100
  },
  {
    id: 3,
    icon: "🧼",
    title: "Hygiene Habits",
    description: "Build healthy daily routines like hand washing and keeping clean.",
    level: "Easy",
    duration: "5 min video",
    quiz: "5 questions",
    progress: 40
  },
  {
    id: 4,
    icon: "🤝",
    title: "Body Safety",
    description: "Learn good touch, bad touch, and when to tell a trusted adult.",
    level: "Medium",
    duration: "4 min video",
    quiz: "5 questions",
    progress: 80
  }
];

const topicsGrid = document.getElementById("topicsGrid");
const searchInput = document.getElementById("searchInput");

function renderTopics(topicList) {
  topicsGrid.innerHTML = "";

  if (topicList.length === 0) {
    topicsGrid.innerHTML = `<div class="no-results">No awareness topic found.</div>`;
    return;
  }

  topicList.forEach((topic) => {
    const card = document.createElement("div");
    card.className = "topic-card";

    card.innerHTML = `
      <div class="topic-top">
        <div class="topic-icon">${topic.icon}</div>
        <span class="topic-level">${topic.level}</span>
      </div>

      <h4>${topic.title}</h4>
      <p>${topic.description}</p>

      <div class="topic-meta">
        <span class="meta-pill">🎥 ${topic.duration}</span>
        <span class="meta-pill">📝 ${topic.quiz}</span>
      </div>

      <div class="topic-progress">
        <div class="progress-label-row">
          <span>Topic Progress</span>
          <span>${topic.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${topic.progress}%"></div>
        </div>
      </div>

      <div class="topic-actions">
        <a href="../awareness-video/awareness-video.html?topic=${encodeURIComponent(topic.title)}" class="action-btn video-btn">
          ▶ Watch Video
        </a>
        <a href="../awareness-quiz/awareness-quiz.html?topic=${encodeURIComponent(topic.title)}" class="action-btn quiz-btn">
          🧠 Start Quiz
        </a>
      </div>
    `;

    topicsGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  const filtered = topics.filter((topic) =>
    topic.title.toLowerCase().includes(value) ||
    topic.description.toLowerCase().includes(value)
  );

  renderTopics(filtered);
});

renderTopics(topics);