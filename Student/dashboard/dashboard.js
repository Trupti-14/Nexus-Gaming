const studentData = {
  name: "Aryan45",
  className: "Grade 1 Student",
  avatar: "A",
  stars: 120,
  lessons: 18,
  games: 12,
  quizzes: 9,
  streak: 5,
  mathsProgress: 70,
  englishProgress: 55,
  recentActivity: [
    {
      icon: "🧮",
      title: "Played Maths Puzzle",
      subtitle: "Completed number matching game"
    },
    {
      icon: "📖",
      title: "Watched English Lesson",
      subtitle: "Learned alphabet sounds"
    },
    {
      icon: "🧠",
      title: "Finished English Quiz",
      subtitle: "Teacher review: Very Good ⭐⭐⭐⭐"
    }
  ]
};

function loadDashboard() {
  const savedUser = JSON.parse(localStorage.getItem("currentUser"));
  const user = savedUser || studentData;

  document.getElementById("studentName").textContent = user.name || studentData.name;
  document.getElementById("welcomeName").textContent = user.name || studentData.name;
  document.getElementById("studentClass").textContent = user.className || studentData.className;
  document.getElementById("studentAvatar").textContent =
    (user.avatar || user.name?.charAt(0) || "A").toUpperCase();

  document.getElementById("topStars").textContent = user.stars || studentData.stars;
  document.getElementById("starsCount").textContent = user.stars || studentData.stars;
  document.getElementById("lessonsCount").textContent = user.lessons || studentData.lessons;
  document.getElementById("gamesCount").textContent = user.games || studentData.games;
  document.getElementById("quizCount").textContent = user.quizzes || studentData.quizzes;
  document.getElementById("streakCount").textContent = user.streak || studentData.streak;

  const mathsProgress = user.mathsProgress || studentData.mathsProgress;
  const englishProgress = user.englishProgress || studentData.englishProgress;

  document.getElementById("mathProgressBar").style.width = mathsProgress + "%";
  document.getElementById("englishProgressBar").style.width = englishProgress + "%";
  document.getElementById("mathProgressText").textContent = mathsProgress + "%";
  document.getElementById("englishProgressText").textContent = englishProgress + "%";

  renderActivity(user.recentActivity || studentData.recentActivity);
}

function renderActivity(activities) {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  activities.forEach(activity => {
    const item = document.createElement("div");
    item.className = "activity-item";
    item.innerHTML = `
      <div class="activity-icon">${activity.icon}</div>
      <div>
        <div class="activity-title">${activity.title}</div>
        <div class="activity-subtitle">${activity.subtitle}</div>
      </div>
    `;
    activityList.appendChild(item);
  });
}

function openSubject(subject) {
  if (subject === "maths") {
    window.location.href = "maths.html";
  } else if (subject === "english") {
    window.location.href = "english.html";
  }
}

const continueBtn = document.getElementById("continueBtn");
if (continueBtn) {
  continueBtn.addEventListener("click", function () {
    window.location.href = "subjects.html";
  });
}

const challengeBtn = document.getElementById("challengeBtn");
if (challengeBtn) {
  challengeBtn.addEventListener("click", function () {
    alert("⭐ Challenge started! Solve 5 number puzzles!");
    window.location.href = "maths.html";
  });
}

const quickContinueBtn = document.getElementById("quickContinue");
if (quickContinueBtn) {
  quickContinueBtn.addEventListener("click", function () {
    window.location.href = "subjects.html";
  });
}

const quickGameBtn = document.getElementById("quickGame");
if (quickGameBtn) {
  quickGameBtn.addEventListener("click", function () {
    window.location.href = "games.html";
  });
}

const quickQuizBtn = document.getElementById("quickQuiz");
if (quickQuizBtn) {
  quickQuizBtn.addEventListener("click", function () {
    window.location.href = "quiz.html";
  });
}

const quickAwarenessBtn = document.getElementById("quickAwareness");
if (quickAwarenessBtn) {
  quickAwarenessBtn.addEventListener("click", function () {
    window.location.href = "awareness.html";
  });
}

const notificationBtn = document.getElementById("notificationBtn");
if (notificationBtn) {
  notificationBtn.addEventListener("click", function () {
    window.location.href = "notifications.html";
  });
}

const helpBtn = document.getElementById("helpBtn");
if (helpBtn) {
  helpBtn.addEventListener("click", function () {
    alert("Choose a subject, play games, solve quizzes, and earn stars!");
  });
}

loadDashboard();