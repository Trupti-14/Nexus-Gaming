const achievements = [
  { icon: "🏅", title: "Math Starter", desc: "Completed first Mathematics chapter", status: "Unlocked" },
  { icon: "🛡️", title: "Safety Hero", desc: "Finished Awareness quiz successfully", status: "Unlocked" },
  { icon: "🔥", title: "3-Day Streak", desc: "Learned for 3 days continuously", status: "Unlocked" },
  { icon: "⭐", title: "Quiz Master", desc: "Scored above 90% in a quiz", status: "Unlocked" },
  { icon: "🎮", title: "Game Champion", desc: "Won practice game with full stars", status: "Unlocked" },
  { icon: "🚀", title: "Fast Learner", desc: "Completed 5 lessons in one week", status: "Unlocked" }
];

const achievementGrid = document.getElementById("achievementGrid");

achievements.forEach(item => {
  const card = document.createElement("div");
  card.className = "achievement-card";
  card.innerHTML = `
    <div class="achievement-icon">${item.icon}</div>
    <h4>${item.title}</h4>
    <p>${item.desc}</p>
    <span class="status-pill">${item.status}</span>
  `;
  achievementGrid.appendChild(card);
});