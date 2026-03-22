const subjects = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "➕",
    level: "Core Subject",
    desc: "Learn numbers, addition, subtraction, shapes, and fun problem solving.",
    progress: 68,
    stars: 18,
    fillClass: "math-fill"
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    level: "Language Subject",
    desc: "Build reading, phonics, vocabulary, and sentence understanding skills.",
    progress: 54,
    stars: 14,
    fillClass: "eng-fill"
  },
  {
    id: "science",
    name: "Science",
    icon: "🧪",
    level: "Discovery Subject",
    desc: "Explore plants, animals, body parts, weather, and simple experiments.",
    progress: 42,
    stars: 11,
    fillClass: "sci-fill"
  },
  {
    id: "evs",
    name: "EVS",
    icon: "🌍",
    level: "Environment",
    desc: "Understand family, surroundings, hygiene, helpers, and daily life.",
    progress: 77,
    stars: 20,
    fillClass: "ev-fill"
  }
];

const subjectsGrid = document.getElementById("subjectsGrid");
const searchInput = document.getElementById("searchInput");

function renderSubjects(list) {
  subjectsGrid.innerHTML = "";

  list.forEach(subject => {
    const card = document.createElement("div");
    card.className = "subject-box";
    card.innerHTML = `
      <div class="subject-top">
        <div class="subject-icon">${subject.icon}</div>
        <span class="subject-tag">${subject.level}</span>
      </div>
      <h4>${subject.name}</h4>
      <p>${subject.desc}</p>
      <div class="progress-row">
        <span>Progress</span>
        <span>${subject.progress}%</span>
      </div>
      <div class="subject-progress">
        <div class="subject-progress-fill ${subject.fillClass}" style="width:${subject.progress}%"></div>
      </div>
      <div class="stars-line">⭐ ${subject.stars} Stars Earned</div>
      <a href="chapter-detail.html?subject=${subject.id}" class="action-btn" data-id="${subject.id}">Start / Continue</a>
    `;
    subjectsGrid.appendChild(card);
  });

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const subjectId = btn.getAttribute("data-id");
      const selected = subjects.find(item => item.id === subjectId);
      localStorage.setItem("selectedSubject", JSON.stringify(selected));
      window.location.href = btn.href;
    });
  });
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = subjects.filter(subject =>
    subject.name.toLowerCase().includes(value)
  );
  renderSubjects(filtered);
});

renderSubjects(subjects);