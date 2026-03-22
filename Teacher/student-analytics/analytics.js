const subjectFilter = document.getElementById("subjectFilter");
const classFilter = document.getElementById("classFilter");
const dateFilter = document.getElementById("dateFilter");

const avgScoreEl = document.getElementById("avgScore");
const completionRateEl = document.getElementById("completionRate");
const activeStudentsEl = document.getElementById("activeStudents");
const lowPerformersEl = document.getElementById("lowPerformers");

const analyticsTableBody = document.getElementById("analyticsTableBody");
const tableSearchInput = document.getElementById("tableSearch");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const barChart = document.getElementById("barChart");
const pieChart = document.getElementById("pieChart");
const lineChart = document.getElementById("lineChart");
const lineChartTooltip = document.getElementById("lineChartTooltip");
const topPerformersList = document.getElementById("topPerformersList");
const weakTopicsList = document.getElementById("weakTopicsList");

let currentSort = { key: "name", direction: "asc" };
const analyticsData = [
  {
    name: "Aarav",
    className: "LKG-A",
    subject: "English",
    quizAverage: 88,
    assignmentStatus: "Completed",
    activity: "High",
    attendance: 95
  },
  {
    name: "Diya",
    className: "LKG-A",
    subject: "Maths",
    quizAverage: 72,
    assignmentStatus: "Pending",
    activity: "Medium",
    attendance: 82
  },
  {
    name: "Vivaan",
    className: "UKG-A",
    subject: "English",
    quizAverage: 91,
    assignmentStatus: "Completed",
    activity: "High",
    attendance: 97
  },
  {
    name: "Anaya",
    className: "UKG-A",
    subject: "Maths",
    quizAverage: 64,
    assignmentStatus: "Pending",
    activity: "Low",
    attendance: 75
  },
  {
    name: "Krish",
    className: "1st-A",
    subject: "English",
    quizAverage: 79,
    assignmentStatus: "Completed",
    activity: "Medium",
    attendance: 88
  },
  {
    name: "Meera",
    className: "1st-A",
    subject: "Maths",
    quizAverage: 94,
    assignmentStatus: "Completed",
    activity: "High",
    attendance: 98
  }
];

const weakTopicsData = [
  { topic: "Vocabulary Development", subject: "English", weakness: "LKG students need more practice in word-picture matching." },
  { topic: "Basic Operations", subject: "Maths", weakness: "UKG students show lower scores in addition and subtraction." },
  { topic: "Writing Skills", subject: "English", weakness: "1st standard students need spelling and sentence practice." }
];

function getFilteredData() {
  const subjectValue = subjectFilter.value;
  const classValue = classFilter.value;
  const searchTerm = tableSearchInput?.value.trim().toLowerCase() || "";

  return analyticsData.filter((item) => {
    const subjectMatch = subjectValue === "" || item.subject === subjectValue;
    const classMatch = classValue === "" || item.className === classValue;
    const searchMatch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm) ||
      item.className.toLowerCase().includes(searchTerm) ||
      item.subject.toLowerCase().includes(searchTerm);

    return subjectMatch && classMatch && searchMatch;
  });
}

function sortData(data) {
  const sorted = [...data];
  const { key, direction } = currentSort;

  sorted.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    if (aStr < bStr) return direction === "asc" ? -1 : 1;
    if (aStr > bStr) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}

function updateSortIndicators() {
  document.querySelectorAll("th.sortable").forEach((th) => {
    const key = th.getAttribute("data-sort-key");
    if (key === currentSort.key) {
      th.classList.add(currentSort.direction);
    } else {
      th.classList.remove("asc", "desc");
    }
  });
}

function setSortKey(key) {
  if (currentSort.key === key) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort.key = key;
    currentSort.direction = "asc";
  }
  updateSortIndicators();
  renderAll();
}

function resetFilters() {
  subjectFilter.value = "";
  classFilter.value = "";
  dateFilter.value = "30";
  tableSearchInput.value = "";
  currentSort = { key: "name", direction: "asc" };
  updateSortIndicators();
  renderAll();
}

function viewStudentReport(studentName) {
  // Redirects to the student report page. Query params can be used later for a real implementation.
  window.location.href = `../student-report/report.html?student=${encodeURIComponent(studentName)}`;
}

function getProgressPoints() {
  const days = Number(dateFilter.value);

  if (days === 7) {
    return [68, 72, 75, 77, 80, 83, 86];
  }

  if (days === 90) {
    return [55, 60, 64, 68, 72, 76, 80];
  }

  // Default: last 30 days
  return [58, 66, 70, 76, 82, 88, 91];
}

function renderSummary(data) {
  if (data.length === 0) {
    avgScoreEl.textContent = "0%";
    completionRateEl.textContent = "0%";
    activeStudentsEl.textContent = "0";
    lowPerformersEl.textContent = "0";
    return;
  }

  const avgScore = Math.round(
    data.reduce((sum, item) => sum + item.quizAverage, 0) / data.length
  );

  const completedCount = data.filter((item) => item.assignmentStatus === "Completed").length;
  const completionRate = Math.round((completedCount / data.length) * 100);

  const activeStudents = data.filter((item) => item.activity === "High" || item.activity === "Medium").length;
  const lowPerformers = data.filter((item) => item.quizAverage < 70).length;

  avgScoreEl.textContent = `${avgScore}%`;
  completionRateEl.textContent = `${completionRate}%`;
  activeStudentsEl.textContent = activeStudents;
  lowPerformersEl.textContent = lowPerformers;

  const completedAngle = Math.round((completedCount / data.length) * 360);
  pieChart.style.background = `conic-gradient(#31ff9b 0deg ${completedAngle}deg, rgba(255,193,7,0.85) ${completedAngle}deg 360deg)`;
}

function renderBarChart(data) {
  barChart.innerHTML = "";

  if (data.length === 0) {
    barChart.innerHTML = "<p>No chart data available.</p>";
    return;
  }

  data.forEach((item) => {
    const barItem = document.createElement("div");
    barItem.className = "bar-item";

    barItem.innerHTML = `
      <div class="bar-value">${item.quizAverage}%</div>
      <div class="bar-track">
        <div class="bar-fill" style="height: ${item.quizAverage}%"></div>
      </div>
      <div class="bar-label">${item.name}<br>${item.subject}</div>
    `;

    barChart.appendChild(barItem);
  });
}

function renderLineChart() {
  const width = 700;
  const height = 240;
  const padding = 30;

  const progressPoints = getProgressPoints();
  const maxValue = 100;
  const stepX = (width - padding * 2) / (progressPoints.length - 1);

  const points = progressPoints
    .map((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((value / maxValue) * (height - padding * 2));
      return `${x},${y}`;
    })
    .join(" ");

  lineChart.innerHTML = `
    <polyline
      fill="none"
      stroke="#19e3ff"
      stroke-width="4"
      points="${points}"
    />
    ${progressPoints
      .map((value, index) => {
        const x = padding + index * stepX;
        const y = height - padding - ((value / maxValue) * (height - padding * 2));
        return `<circle cx="${x}" cy="${y}" r="7" fill="#ff2ea6" stroke="#ffffff" stroke-width="2" opacity="0.9" data-day="${index + 1}" data-value="${value}" />`;
      })
      .join("")}
  `;

  if (!lineChartTooltip) return;

  const chartRect = lineChart.getBoundingClientRect();
  const svgContainer = lineChart.parentElement;

  function updateTooltipPosition(evt) {
    const rect = svgContainer.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    lineChartTooltip.style.left = `${x}px`;
    lineChartTooltip.style.top = `${y - 12}px`;
  }

  lineChart.querySelectorAll("circle").forEach((circle) => {
    circle.addEventListener("mouseenter", (evt) => {
      const day = circle.getAttribute("data-day");
      const value = circle.getAttribute("data-value");
      lineChartTooltip.textContent = `Day ${day}: ${value}%`;
      lineChartTooltip.style.display = "block";
      updateTooltipPosition(evt);
    });

    circle.addEventListener("mousemove", (evt) => {
      updateTooltipPosition(evt);
    });

    circle.addEventListener("mouseleave", () => {
      lineChartTooltip.style.display = "none";
    });
  });
}

function renderTopPerformers(data) {
  topPerformersList.innerHTML = "";

  const topThree = [...data]
    .sort((a, b) => b.quizAverage - a.quizAverage)
    .slice(0, 3);

  if (topThree.length === 0) {
    topPerformersList.innerHTML = "<p>No top performers found.</p>";
    return;
  }

  topThree.forEach((student, index) => {
    const div = document.createElement("div");
    div.className = "list-item clickable";
    div.innerHTML = `
      <h4>#${index + 1} ${student.name}</h4>
      <p>${student.className} • ${student.subject}</p>
      <p>Quiz Average: ${student.quizAverage}% • Activity: ${student.activity}</p>
    `;

    div.addEventListener("click", () => {
      viewStudentReport(student.name);
    });

    topPerformersList.appendChild(div);
  });
}

function renderWeakTopics() {
  weakTopicsList.innerHTML = "";

  weakTopicsData.forEach((topic) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `
      <h4>${topic.topic}</h4>
      <p>Subject: ${topic.subject}</p>
      <p>${topic.weakness}</p>
    `;
    weakTopicsList.appendChild(div);
  });
}

function renderTable(data) {
  analyticsTableBody.innerHTML = "";

  if (data.length === 0) {
    analyticsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">No analytics data found.</td>
      </tr>
    `;
    return;
  }

  const tableData = sortData(data);

  tableData.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.className === "1st-A" ? "1st-A" : item.className}</td>
      <td>${item.subject}</td>
      <td>${item.quizAverage}%</td>
      <td>
        <span class="status-pill ${item.assignmentStatus === "Completed" ? "completed-pill" : "pending-pill"}">
          ${item.assignmentStatus}
        </span>
      </td>
      <td>${item.attendance}% • ${item.activity}</td>
    `;

    analyticsTableBody.appendChild(row);
  });
}

function renderAll() {
  updateSortIndicators();
  const filteredData = getFilteredData();
  renderSummary(filteredData);
  renderBarChart(filteredData);
  renderLineChart();
  renderTopPerformers(filteredData);
  renderWeakTopics();
  renderTable(filteredData);
}

function downloadReportTxt() {
  const filteredData = getFilteredData();

  let reportText = "Student Analytics Report\n\n";
  filteredData.forEach((item) => {
    reportText += `Name: ${item.name}\n`;
    reportText += `Class: ${item.className}\n`;
    reportText += `Subject: ${item.subject}\n`;
    reportText += `Quiz Average: ${item.quizAverage}%\n`;
    reportText += `Assignment Status: ${item.assignmentStatus}\n`;
    reportText += `Attendance/Activity: ${item.attendance}% / ${item.activity}\n`;
    reportText += `-----------------------------\n`;
  });

  const blob = new Blob([reportText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "student_analytics_report.txt";
  link.click();
}

function downloadReportCsv() {
  const filteredData = getFilteredData();

  const csvHeader = [
    "Name",
    "Class",
    "Subject",
    "Quiz Average",
    "Assignment Status",
    "Attendance",
    "Activity",
  ];

  const rows = filteredData.map((item) => [
    item.name,
    item.className,
    item.subject,
    item.quizAverage,
    item.assignmentStatus,
    item.attendance,
    item.activity,
  ]);

  const csvContent = [csvHeader, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "student_analytics_report.csv";
  link.click();
}

subjectFilter.addEventListener("change", renderAll);
classFilter.addEventListener("change", renderAll);
dateFilter.addEventListener("change", renderAll);

tableSearchInput?.addEventListener("input", renderAll);
resetFiltersBtn?.addEventListener("click", resetFilters);

// Make table headers sortable
const sortableHeaders = document.querySelectorAll("th.sortable");
sortableHeaders.forEach((th) => {
  th.addEventListener("click", () => {
    const key = th.getAttribute("data-sort-key");
    if (key) setSortKey(key);
  });
});

renderAll();