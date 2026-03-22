const notificationsData = [
  {
    id: 1,
    icon: "📘",
    title: "New Mathematics Chapter Added",
    message: "A new chapter 'Shapes Around Us' is now available in your Education Module.",
    category: "education",
    time: "10 min ago",
    unread: true
  },
  {
    id: 2,
    icon: "🛡️",
    title: "Awareness Quiz Reminder",
    message: "Complete your Internet Safety quiz today to earn bonus stars.",
    category: "awareness",
    time: "25 min ago",
    unread: true
  },
  {
    id: 3,
    icon: "🏆",
    title: "New Badge Earned",
    message: "Congratulations! You unlocked the 'Quick Learner' badge.",
    category: "achievement",
    time: "1 hour ago",
    unread: false
  },
  {
    id: 4,
    icon: "⭐",
    title: "Stars Added to Your Account",
    message: "You earned 15 stars after completing the Addition Basics practice game.",
    category: "education",
    time: "2 hours ago",
    unread: false
  },
  {
    id: 5,
    icon: "🔔",
    title: "Daily Learning Reminder",
    message: "Spend 15 minutes today to maintain your 5-day learning streak.",
    category: "education",
    time: "Today, 8:30 AM",
    unread: true
  },
  {
    id: 6,
    icon: "💡",
    title: "Safety Topic Updated",
    message: "A new awareness story about Road Safety has been added for this week.",
    category: "awareness",
    time: "Yesterday",
    unread: false
  }
];

let notifications = [...notificationsData];
let currentFilter = "all";

const notificationList = document.getElementById("notificationList");
const markAllReadBtn = document.getElementById("markAllReadBtn");
const tabButtons = document.querySelectorAll(".tab-btn");

function renderNotifications() {
  let filtered = notifications;

  if (currentFilter === "unread") {
    filtered = notifications.filter(item => item.unread);
  } else if (currentFilter !== "all") {
    filtered = notifications.filter(item => item.category === currentFilter);
  }

  notificationList.innerHTML = "";

  if (filtered.length === 0) {
    notificationList.innerHTML = `
      <div class="empty-state">
        No notifications found for this category.
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = `notification-card ${item.unread ? "unread" : ""}`;

    card.innerHTML = `
      <div class="notification-icon">${item.icon}</div>

      <div class="notification-content">
        <div class="notification-title-row">
          <div class="notification-title">${item.title}</div>
          <div class="notification-time">${item.time}</div>
        </div>

        <div class="notification-message">${item.message}</div>

        <div class="notification-meta">
          <span class="meta-pill category">${capitalize(item.category)}</span>
          <span class="meta-pill status">${item.unread ? "Unread" : "Read"}</span>
        </div>

        <div class="notification-actions">
          ${
            item.unread
              ? `<button class="small-btn read-btn" onclick="markAsRead(${item.id})">Mark as Read</button>`
              : ""
          }
          <button class="small-btn delete-btn" onclick="deleteNotification(${item.id})">Delete</button>
        </div>
      </div>
    `;

    notificationList.appendChild(card);
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function markAsRead(id) {
  notifications = notifications.map(item =>
    item.id === id ? { ...item, unread: false } : item
  );
  renderNotifications();
}

function deleteNotification(id) {
  notifications = notifications.filter(item => item.id !== id);
  renderNotifications();
}

markAllReadBtn.addEventListener("click", () => {
  notifications = notifications.map(item => ({ ...item, unread: false }));
  renderNotifications();
});

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(tab => tab.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderNotifications();
  });
});

renderNotifications();