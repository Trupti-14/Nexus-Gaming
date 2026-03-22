const chapterData = {
  mathematics: {
    title: "Mathematics",
    desc: "Explore all chapters and continue your learning journey in Mathematics.",
    progress: 68,
    chapters: [
      { no: 1, title: "Addition Basics", desc: "Learn how to add numbers using objects and pictures.", level: "Easy", progress: 80 },
      { no: 2, title: "Subtraction Fun", desc: "Understand subtraction through simple examples.", level: "Easy", progress: 60 },
      { no: 3, title: "Shapes Around Us", desc: "Identify common shapes in daily life.", level: "Medium", progress: 45 },
      { no: 4, title: "Counting Practice", desc: "Build strong number counting skills.", level: "Easy", progress: 88 }
    ]
  },
  english: {
    title: "English",
    desc: "Read, learn words, and improve your speaking and writing.",
    progress: 54,
    chapters: [
      { no: 1, title: "Alphabet Sounds", desc: "Recognize letters and their basic sounds.", level: "Easy", progress: 75 },
      { no: 2, title: "Simple Words", desc: "Learn everyday words with pictures.", level: "Easy", progress: 50 },
      { no: 3, title: "Sentence Building", desc: "Create short and meaningful sentences.", level: "Medium", progress: 35 }
    ]
  },
  science: {
    title: "Science",
    desc: "Discover the world of nature, plants, animals, and experiments.",
    progress: 42,
    chapters: [
      { no: 1, title: "Living and Non-Living", desc: "Understand what is alive and what is not.", level: "Easy", progress: 52 },
      { no: 2, title: "Plants Around Us", desc: "Learn about parts of plants and their uses.", level: "Medium", progress: 38 },
      { no: 3, title: "Body Parts", desc: "Identify body parts and their functions.", level: "Easy", progress: 41 }
    ]
  },
  evs: {
    title: "EVS",
    desc: "Know your environment, hygiene, family, and daily surroundings.",
    progress: 77,
    chapters: [
      { no: 1, title: "My Family", desc: "Learn about family members and relationships.", level: "Easy", progress: 90 },
      { no: 2, title: "Healthy Habits", desc: "Build hygiene and healthy daily routines.", level: "Easy", progress: 82 },
      { no: 3, title: "Community Helpers", desc: "Know the people who help us every day.", level: "Medium", progress: 61 }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const subjectIdFromUrl = params.get("subject");
const storedSubject = JSON.parse(localStorage.getItem("selectedSubject"));
const subjectKey = subjectIdFromUrl || storedSubject?.id || "mathematics";

const subject = chapterData[subjectKey] || chapterData.mathematics;

document.getElementById("subjectTitle").textContent = subject.title;
document.getElementById("subjectDesc").textContent = subject.desc;
document.getElementById("topbarText").textContent = `${subject.title} chapters are ready for learning, practice, and quiz.`;
document.getElementById("overallProgressText").textContent = `${subject.progress}%`;
document.getElementById("overallProgressFill").style.width = `${subject.progress}%`;

const chapterList = document.getElementById("chapterList");
const continueBtn = document.getElementById("continueBtn");

subject.chapters.forEach((chapter, index) => {
  const card = document.createElement("div");
  card.className = "chapter-card";

  card.innerHTML = `
    <div class="chapter-top">
      <span class="chapter-no">Chapter ${chapter.no}</span>
      <span class="chapter-level">${chapter.level}</span>
    </div>
    <h3>${chapter.title}</h3>
    <p>${chapter.desc}</p>

    <div class="small-progress">
      <div class="progress-row">
        <span>Chapter Progress</span>
        <span>${chapter.progress}%</span>
      </div>
      <div class="small-progress-bar">
        <div class="small-progress-fill" style="width:${chapter.progress}%"></div>
      </div>
    </div>

    <div class="chapter-actions">
      <a href="concept-video.html" class="action-btn learn-btn" data-index="${index}">📺 Learn</a>
      <a href="game-practice.html" class="action-btn practice-btn" data-index="${index}">🎮 Practice</a>
      <a href="quiz.html" class="action-btn quiz-btn" data-index="${index}">📝 Quiz</a>
    </div>
  `;

  chapterList.appendChild(card);
});

function saveChapter(index) {
  localStorage.setItem("selectedSubjectDetail", JSON.stringify(subject));
  localStorage.setItem("selectedChapter", JSON.stringify(subject.chapters[index]));
}

document.querySelectorAll(".learn-btn, .practice-btn, .quiz-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    saveChapter(btn.dataset.index);
  });
});

continueBtn.addEventListener("click", () => {
  saveChapter(0);
});