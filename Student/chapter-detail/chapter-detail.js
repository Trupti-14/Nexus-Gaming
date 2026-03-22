const subjectBadge = document.getElementById("subjectBadge");
const subjectTitle = document.getElementById("subjectTitle");
const subjectDescription = document.getElementById("subjectDescription");
const chapterGrid = document.getElementById("chapterGrid");

const params = new URLSearchParams(window.location.search);
const selectedSubject = params.get("subject") || "english";

const subjectData = {
  english: {
    badge: "English Subject",
    title: "English Learning Chapters",
    description:
      "Learn English through fun chapter-based lessons designed for LKG to 1st standard students. Each chapter includes concept learning, practice activities, and a quiz.",
    chapters: [
      {
        number: "01",
        title: "Alphabet Learning",
        summary: "Learn English letters with pictures, sounds, and fun examples like A for Apple.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 85
      },
      {
        number: "02",
        title: "Animal Names",
        summary: "Discover common animal names with images and simple pronunciation support.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 70
      },
      {
        number: "03",
        title: "Fruits and Vegetables",
        summary: "Learn names of fruits and vegetables using bright visuals and interactive activities.",
        difficulty: "Medium",
        difficultyClass: "medium",
        progress: 55
      },
      {
        number: "04",
        title: "Colors",
        summary: "Understand color names, recognize objects, and enjoy engaging color-based examples.",
        difficulty: "Medium",
        difficultyClass: "medium",
        progress: 62
      },
      {
        number: "05",
        title: "Simple Words",
        summary: "Build simple vocabulary through examples, reading activities, and mini exercises.",
        difficulty: "Advanced",
        difficultyClass: "hard",
        progress: 40
      }
    ]
  },

  maths: {
    badge: "Maths Subject",
    title: "Maths Learning Chapters",
    description:
      "Learn maths with simple numbers, counting, shapes, addition, and subtraction lessons designed for young students. Each chapter includes learning, practice, and quiz sections.",
    chapters: [
      {
        number: "01",
        title: "Numbers 1 to 20",
        summary: "Learn numbers through counting visuals and number recognition activities.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 80
      },
      {
        number: "02",
        title: "Basic Addition",
        summary: "Understand simple addition using objects, pictures, and fun examples.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 68
      },
      {
        number: "03",
        title: "Basic Subtraction",
        summary: "Practice subtracting small numbers with visual learning support.",
        difficulty: "Medium",
        difficultyClass: "medium",
        progress: 52
      },
      {
        number: "04",
        title: "Shapes",
        summary: "Identify basic shapes like circle, square, triangle, and rectangle.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 74
      },
      {
        number: "05",
        title: "Big and Small",
        summary: "Compare object sizes and understand the concepts of big and small.",
        difficulty: "Easy",
        difficultyClass: "easy",
        progress: 47
      }
    ]
  }
};

function renderChapterPage() {
  const data = subjectData[selectedSubject];

  subjectBadge.textContent = data.badge;
  subjectTitle.textContent = data.title;
  subjectDescription.textContent = data.description;

  chapterGrid.innerHTML = "";

  data.chapters.forEach((chapter, index) => {
    const card = document.createElement("div");
    card.className = "chapter-card";
    card.innerHTML = `
      <div class="chapter-top">
        <div class="chapter-number">${chapter.number}</div>
        <div class="difficulty-pill ${chapter.difficultyClass}">${chapter.difficulty}</div>
      </div>

      <h4>${chapter.title}</h4>
      <p class="chapter-summary">${chapter.summary}</p>

      <div class="chapter-progress-wrap">
        <div class="chapter-progress-label">
          <span>Progress</span>
          <span>${chapter.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${chapter.progress}%; background: linear-gradient(90deg, var(--cyan), var(--pink));"></div>
        </div>
      </div>

      <div class="chapter-actions">
        <button class="action-btn outline-btn learn-btn" data-title="${chapter.title}">Learn</button>
        <button class="action-btn practice-btn" data-title="${chapter.title}">Practice</button>
        <button class="action-btn quiz-btn" data-title="${chapter.title}">Quiz</button>
      </div>
    `;

    chapterGrid.appendChild(card);
  });

  attachButtonEvents();
}

function attachButtonEvents() {
  document.querySelectorAll(".learn-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const chapterTitle = this.dataset.title;
      alert(`Open Learn page for ${selectedSubject} - ${chapterTitle}`);
    });
  });

  document.querySelectorAll(".practice-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const chapterTitle = this.dataset.title;
      alert(`Open Practice page for ${selectedSubject} - ${chapterTitle}`);
    });
  });

  document.querySelectorAll(".quiz-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const chapterTitle = this.dataset.title;
      alert(`Open Quiz page for ${selectedSubject} - ${chapterTitle}`);
    });
  });
}

renderChapterPage();