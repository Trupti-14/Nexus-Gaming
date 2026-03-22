document.addEventListener("DOMContentLoaded", () => {
  const notificationsData = [
    {
      id: 1,
      type: "activity",
      title: "Child completed a game",
      message: "Aarav completed the Counting Game with a score of 76.",
      time: "Today, 10:15 AM",
      read: false,
      icon: "🎮"
    },
    {
      id: 2,
      type: "achievement",
      title: "New badge earned",
      message: "Your child earned the English Explorer badge.",
      time: "Today, 9:20 AM",
      read: false,
      icon: "🏅"
    },
    {
      id: 3,
      type: "message",
      title: "Teacher message received",
      message: "The child is improving well in alphabet matching activities.",
      time: "Yesterday, 5:40 PM",
      read: false,
      icon: "💬"
    },
    {
      id: 4,
      type: "activity",
      title: "Child completed an English quiz",
      message: "Aarav completed the English Quiz with 84% accuracy.",
      time: "Yesterday, 3:10 PM",
      read: true,
      icon: "📘"
    },
    {
      id: 5,
      type: "achievement",
      title: "Level up achieved",
      message: "Your child reached Level 3 after completing subject tasks.",
      time: "2 days ago",
      read: true,
      icon: "⭐"
    },
    {
      id: 6,
      type: "message",
      title: "Teacher suggestion received",
      message: "Please practice number recognition at home for 10 minutes daily.",
      time: "2 days ago",
      read: false,
      icon: "📩"
    }
  ];

  let currentFilter = "all";

  const notificationsList = document.getElementById("notificationsList");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const totalNotifications = document.getElementById("totalNotifications");
  const achievementCount = document.getElementById("achievementCount");
  const messageCount = document.getElementById("messageCount");
  const unreadCount = document.getElementById("unreadCount");
  const markAllReadBtn = document.getElementById("markAllReadBtn");
  const clearReadBtn = document.getElementById("clearReadBtn");
  const notificationBtn = document.getElementById("notificationBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const messageBox = document.getElementById("messageBox");

  function showMessage(message) {
    messageBox.textContent = message;
    setTimeout(() => {
      messageBox.textContent = "";
    }, 2500);
  }

  function updateStats() {
    totalNotifications.textContent = notificationsData.length;
    achievementCount.textContent = notificationsData.filter(item => item.type === "achievement").length;
    messageCount.textContent = notificationsData.filter(item => item.type === "message").length;
    unreadCount.textContent = notificationsData.filter(item => !item.read).length;
  }

  function getFilteredData() {
    if (currentFilter === "all") {
      return notificationsData;
    }
    return notificationsData.filter(item => item.type === currentFilter.slice(0, -1) || item.type === currentFilter);
  }

  function renderNotifications() {
    const filteredData = getFilteredData();
    notificationsList.innerHTML = "";

    if (filteredData.length === 0) {
      notificationsList.innerHTML = `
        <div class="notification-card">
          <div class="notification-left">
            <div class="notification-icon activity">📭</div>
            <div class="notification-content">
              <h3>No notifications found</h3>
              <p>There are no notifications in this category right now.</p>
              <span class="notification-time">Just now</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    filteredData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "notification-card";

      card.innerHTML = `
        <div class="notification-left">
          <div class="notification-icon ${item.type}">
            ${item.icon}
          </div>
          <div class="notification-content">
            <h3>${item.title}</h3>
            <p>${item.message}</p>
            <span class="notification-time">${item.time}</span>
          </div>
        </div>

        <div class="notification-right">
          <span class="type-badge ${item.type}">
            ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
          <span class="read-badge ${item.read ? "read" : "unread"}">
            ${item.read ? "Read" : "Unread"}
          </span>
          <button class="mark-read-btn" data-id="${item.id}">
            ${item.read ? "Mark Unread" : "Mark Read"}
          </button>
        </div>
      `;

      notificationsList.appendChild(card);
    });

    attachCardEvents();
  }

  function attachCardEvents() {
    const markReadButtons = document.querySelectorAll(".mark-read-btn");

    markReadButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.dataset.id);
        const item = notificationsData.find(notification => notification.id === id);

        if (item) {
          item.read = !item.read;
          updateStats();
          renderNotifications();
          showMessage(`Notification marked as ${item.read ? "read" : "unread"}.`);
        }
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderNotifications();
    });
  });

  markAllReadBtn.addEventListener("click", () => {
    notificationsData.forEach(item => {
      item.read = true;
    });
    updateStats();
    renderNotifications();
    showMessage("All notifications marked as read.");
  });

  clearReadBtn.addEventListener("click", () => {
    const unreadItems = notificationsData.filter(item => !item.read);
    notificationsData.length = 0;
    notificationsData.push(...unreadItems);
    updateStats();
    renderNotifications();
    showMessage("Read notifications cleared.");
  });

  notificationBtn.addEventListener("click", () => {
  window.location.href = "notifications.html";
});

settingsBtn.addEventListener("click", () => {
  window.location.href = "../settings/settings.html";
});

  logoutBtn.addEventListener("click", () => {
    alert("Logout successful.");
  });

  updateStats();
  renderNotifications();
});

function goToProfile() {
  window.location.href = "../profile/profile.html";
}