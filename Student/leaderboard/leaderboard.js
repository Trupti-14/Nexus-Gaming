const leaderboardData = {
  weekly: [
    { rank: 1, name: "Aarav", points: 980, stars: 52, badges: 6 },
    { rank: 2, name: "Myra", points: 940, stars: 49, badges: 5 },
    { rank: 3, name: "Vivaan", points: 900, stars: 46, badges: 5 },
    { rank: 4, name: "Anaya", points: 860, stars: 43, badges: 4 },
    { rank: 5, name: "Kabir", points: 835, stars: 40, badges: 4 },
    { rank: 6, name: "Ishita", points: 810, stars: 39, badges: 3 },
    { rank: 7, name: "Aryan45", points: 790, stars: 37, badges: 3 },
    { rank: 8, name: "Siya", points: 760, stars: 35, badges: 3 }
  ],
  monthly: [
    { rank: 1, name: "Myra", points: 3520, stars: 175, badges: 14 },
    { rank: 2, name: "Aarav", points: 3440, stars: 169, badges: 13 },
    { rank: 3, name: "Vivaan", points: 3310, stars: 162, badges: 12 },
    { rank: 4, name: "Aryan45", points: 3140, stars: 155, badges: 11 },
    { rank: 5, name: "Anaya", points: 3080, stars: 151, badges: 11 },
    { rank: 6, name: "Kabir", points: 2950, stars: 142, badges: 10 },
    { rank: 7, name: "Ishita", points: 2860, stars: 138, badges: 9 },
    { rank: 8, name: "Siya", points: 2740, stars: 131, badges: 8 }
  ],
  alltime: [
    { rank: 1, name: "Aarav", points: 15400, stars: 720, badges: 26 },
    { rank: 2, name: "Myra", points: 14920, stars: 698, badges: 25 },
    { rank: 3, name: "Aryan45", points: 14500, stars: 670, badges: 24 },
    { rank: 4, name: "Vivaan", points: 14240, stars: 648, badges: 22 },
    { rank: 5, name: "Anaya", points: 13890, stars: 630, badges: 21 },
    { rank: 6, name: "Kabir", points: 13620, stars: 615, badges: 20 },
    { rank: 7, name: "Ishita", points: 13240, stars: 598, badges: 19 },
    { rank: 8, name: "Siya", points: 12980, stars: 580, badges: 18 }
  ],
  subjectwise: [
    { rank: 1, name: "Vivaan", points: 1100, stars: 56, badges: 6 },
    { rank: 2, name: "Aryan45", points: 1040, stars: 51, badges: 5 },
    { rank: 3, name: "Aarav", points: 1005, stars: 49, badges: 5 },
    { rank: 4, name: "Myra", points: 970, stars: 47, badges: 4 },
    { rank: 5, name: "Anaya", points: 925, stars: 44, badges: 4 },
    { rank: 6, name: "Kabir", points: 900, stars: 42, badges: 4 },
    { rank: 7, name: "Ishita", points: 880, stars: 40, badges: 3 },
    { rank: 8, name: "Siya", points: 845, stars: 38, badges: 3 }
  ]
};

const filterButtons = document.querySelectorAll(".filter-btn");
const topThreeGrid = document.getElementById("topThreeGrid");
const leaderboardBody = document.getElementById("leaderboardBody");

let currentFilter = "weekly";

function getInitial(name) {
  return name.charAt(0).toUpperCase();
}

function renderTopThree(data) {
  topThreeGrid.innerHTML = "";

  const topThree = data.slice(0, 3);

  const medals = ["🥇", "🥈", "🥉"];

  topThree.forEach((student, index) => {
    const card = document.createElement("div");
    card.className = `top-card rank-${student.rank}`;

    card.innerHTML = `
      <div class="medal">${medals[index]}</div>
      <div class="avatar-circle">${getInitial(student.name)}</div>
      <h3>${student.name}</h3>
      <p>Rank #${student.rank}</p>
      <p>${student.stars} Stars • ${student.badges} Badges</p>
      <div class="score-line">${student.points} Points</div>
    `;

    topThreeGrid.appendChild(card);
  });
}

function renderTable(data) {
  leaderboardBody.innerHTML = "";

  data.forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><span class="rank-pill">#${student.rank}</span></td>
      <td>${student.name}</td>
      <td>${student.points}</td>
      <td>${student.stars}</td>
      <td><span class="badge-count">${student.badges}</span></td>
    `;

    leaderboardBody.appendChild(row);
  });
}

function renderLeaderboard(filter) {
  const data = leaderboardData[filter];
  renderTopThree(data);
  renderTable(data);
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderLeaderboard(currentFilter);
  });
});

renderLeaderboard(currentFilter);