document.addEventListener("DOMContentLoaded", () => {
  const childData = {
    parentName: "Mrs. Sharma",
    childName: "Aarav Sharma",
    childClass: "UKG",
    level: 3,
    xp: 120,
    streak: "5 Days",
    englishCompletion: 72,
    englishAccuracy: 84,
    mathsCompletion: 58,
    mathsAccuracy: 76,
    teacherFeedback:
      "The child is improving in number recognition and is showing good interest in alphabet activities.",
    teacherSuggestion:
      "Practice counting at home for 10 minutes daily and revise letter matching games.",
    activities: [
      {
        gameName: "Alphabet Match",
        subject: "English",
        score: 88,
        xpEarned: 15,
        datePlayed: "14 Mar 2026"
      },
      {
        gameName: "Word Builder",
        subject: "English",
        score: 92,
        xpEarned: 18,
        datePlayed: "13 Mar 2026"
      },
      {
        gameName: "Counting Game",
        subject: "Maths",
        score: 76,
        xpEarned: 12,
        datePlayed: "15 Mar 2026"
      },
      {
        gameName: "Number Quiz",
        subject: "Maths",
        score: 81,
        xpEarned: 16,
        datePlayed: "12 Mar 2026"
      }
    ]
  };

  const topParentName = document.getElementById("topParentName");
  const childName = document.getElementById("childName");
  const childClass = document.getElementById("childClass");
  const childAvatar = document.getElementById("childAvatar");
  const childLevel = document.getElementById("childLevel");
  const totalXP = document.getElementById("totalXP");
  const learningStreak = document.getElementById("learningStreak");

  const englishCompletionText = document.getElementById("englishCompletionText");
  const englishAccuracyText = document.getElementById("englishAccuracyText");
  const mathsCompletionText = document.getElementById("mathsCompletionText");
  const mathsAccuracyText = document.getElementById("mathsAccuracyText");

  const englishCompletionBar = document.getElementById("englishCompletionBar");
  const englishAccuracyBar = document.getElementById("englishAccuracyBar");
  const mathsCompletionBar = document.getElementById("mathsCompletionBar");
  const mathsAccuracyBar = document.getElementById("mathsAccuracyBar");

  const teacherFeedback = document.getElementById("teacherFeedback");
  const teacherSuggestion = document.getElementById("teacherSuggestion");
  const activityTableBody = document.getElementById("activityTableBody");

  const sortScoreBtn = document.getElementById("sortScoreBtn");
  const sortDateBtn = document.getElementById("sortDateBtn");
  const refreshBtn = document.getElementById("refreshBtn");
  const notificationBtn = document.getElementById("notificationBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const messageBox = document.getElementById("messageBox");

  let activityData = [...childData.activities];

  function showMessage(message) {
    messageBox.textContent = message;
    setTimeout(() => {
      messageBox.textContent = "";
    }, 2500);
  }

  function renderOverview() {
    topParentName.textContent = childData.parentName;
    childName.textContent = childData.childName;
    childClass.textContent = `Class: ${childData.childClass}`;
    childAvatar.textContent = childData.childName.charAt(0).toUpperCase();
    childLevel.textContent = childData.level;
    totalXP.textContent = childData.xp;
    learningStreak.textContent = childData.streak;

    englishCompletionText.textContent = `${childData.englishCompletion}%`;
    englishAccuracyText.textContent = `${childData.englishAccuracy}%`;
    mathsCompletionText.textContent = `${childData.mathsCompletion}%`;
    mathsAccuracyText.textContent = `${childData.mathsAccuracy}%`;

    englishCompletionBar.style.width = `${childData.englishCompletion}%`;
    englishAccuracyBar.style.width = `${childData.englishAccuracy}%`;
    mathsCompletionBar.style.width = `${childData.mathsCompletion}%`;
    mathsAccuracyBar.style.width = `${childData.mathsAccuracy}%`;

    teacherFeedback.textContent = `"${childData.teacherFeedback}"`;
    teacherSuggestion.textContent = childData.teacherSuggestion;
  }

  function renderTable(data) {
    activityTableBody.innerHTML = "";

    data.forEach((activity) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${activity.gameName}</td>
        <td>
          <span class="subject-badge ${activity.subject.toLowerCase()}">
            ${activity.subject}
          </span>
        </td>
        <td>${activity.score}</td>
        <td>${activity.xpEarned}</td>
        <td>${activity.datePlayed}</td>
      `;

      activityTableBody.appendChild(row);
    });
  }

  sortScoreBtn.addEventListener("click", () => {
    activityData.sort((a, b) => b.score - a.score);
    renderTable(activityData);
    showMessage("Game activity sorted by score.");
  });

  sortDateBtn.addEventListener("click", () => {
    activityData.sort((a, b) => new Date(b.datePlayed) - new Date(a.datePlayed));
    renderTable(activityData);
    showMessage("Game activity sorted by date.");
  });

  refreshBtn.addEventListener("click", () => {
    renderOverview();
    renderTable(activityData);
    showMessage("Progress data refreshed.");
  });

  notificationBtn.addEventListener("click", () => {
  window.location.href = "../notifications/notifications.html";
});

settingsBtn.addEventListener("click", () => {
  window.location.href = "../settings/settings.html";
});

  logoutBtn.addEventListener("click", () => {
    alert("Logout successful.");
  });

  renderOverview();
  renderTable(activityData);
});


function goToProfile() {
  window.location.href = "../profile/profile.html";
}