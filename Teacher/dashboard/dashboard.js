const searchInput = document.getElementById("searchInput");
const activityList = document.getElementById("activityList");
const notificationCount = document.getElementById("notificationCount");

const DASHBOARD_ACTIVITY_KEY = "teacherRecentActivities";

const defaultActivities = [
  {
    title: "New assignment submissions received",
    detail: "Science Chapter 3 • Class 9A",
    status: "Pending",
  },
  {
    title: "Physics notes uploaded successfully",
    detail: "Motion and Force • Class 10",
    status: "Published",
  },
  {
    title: "Quiz results generated",
    detail: "Maths Algebra Basics",
    status: "Done",
  },
  {
    title: "New quiz attempts detected",
    detail: "Chemistry Revision Test",
    status: "Live",
  },
];

function getStoredActivities() {
  try {
    const raw = localStorage.getItem(DASHBOARD_ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function storeActivities(activities) {
  try {
    localStorage.setItem(DASHBOARD_ACTIVITY_KEY, JSON.stringify(activities));
  } catch (e) {
    // ignore storage errors
  }
}

function addRecentActivity(activity) {
  const activities = getStoredActivities();
  activities.unshift(activity);
  // keep only last 10
  storeActivities(activities.slice(0, 10));
}

function renderActivityList() {
  const stored = getStoredActivities();
  const activities = stored.length > 0 ? stored : defaultActivities;

  activityList.innerHTML = "";

  activities.forEach((item) => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";

    activityItem.innerHTML = `
      <div>
        <h4>${item.title}</h4>
        <p>${item.detail}</p>
      </div>
      <span class="status ${item.status.toLowerCase()}">${item.status}</span>
    `;

    activityList.appendChild(activityItem);
  });
}

searchInput.addEventListener("keyup", function () {
  const filter = searchInput.value.toLowerCase();
  const activities = activityList.getElementsByClassName("activity-item");

  for (let i = 0; i < activities.length; i++) {
    const text = activities[i].innerText.toLowerCase();
    if (text.includes(filter)) {
      activities[i].style.display = "flex";
    } else {
      activities[i].style.display = "none";
    }
  }
});

function clearNotifications() {
  notificationCount.innerText = "0";
  alert("All notifications cleared.");
}

// Render stored activity list on load
renderActivityList();

function markTaskDone(button) {
  const taskItem = button.parentElement;
  taskItem.style.opacity = "0.5";
  button.innerText = "Completed";
  button.disabled = true;
  button.style.cursor = "not-allowed";
}

function uploadContent() {
  window.location.href = "../content/content.html";
}

function createQuiz() {
  //alert("Redirect to Quiz / Assignment Creation page");
   window.location.href = "../quiz-assignment/quiz.html";
}

function viewReports() {
  //alert("Redirect to Individual Student Report page");
   window.location.href = "../student-report/report.html";
}

function goToAnalytics() {
  //alert("Redirect to Student Analytics page");
   window.location.href = "../student-analytics/analytics.html";
}