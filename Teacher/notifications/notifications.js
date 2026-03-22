const notificationList = document.getElementById("notificationList");
const unreadCountBadge = document.getElementById("unreadCountBadge");

let activeTab = "All";

let notificationsData = [
  {
    id: 1,
    category: "Assignments",
    title: "New Assignment Submission",
    message: "Aarav Sharma submitted the 'Alphabet Practice' assignment.",
    time: "Today • 10:30 AM",
    read: false
  },
  {
    id: 2,
    category: "Quizzes",
    title: "Quiz Completed",
    message: "Meera Joshi completed the 'Reading Skills Quiz' with high accuracy.",
    time: "Today • 09:15 AM",
    read: false
  },
  {
    id: 3,
    category: "Messages",
    title: "New Student Message",
    message: "Parent of Diya Patel asked for homework clarification.",
    time: "Yesterday • 6:40 PM",
    read: true
  },
  {
    id: 4,
    category: "Alerts",
    title: "Deadline Reminder",
    message: "The 'UKG Number Practice' assignment deadline is tomorrow.",
    time: "Yesterday • 4:20 PM",
    read: false
  },
  {
    id: 5,
    category: "Assignments",
    title: "Pending Submission Alert",
    message: "3 students have not yet submitted the latest maths worksheet.",
    time: "Yesterday • 1:10 PM",
    read: true
  },
  {
    id: 6,
    category: "Quizzes",
    title: "New Quiz Attempt",
    message: "Vivaan started the 'Phonics Quick Check' quiz.",
    time: "2 days ago • 11:00 AM",
    read: false
  },
  {
    id: 7,
    category: "Alerts",
    title: "System Alert",
    message: "Content server sync completed successfully for uploaded PDFs.",
    time: "2 days ago • 8:35 AM",
    read: true
  }
];

function loadFeedback() {
  fetch('/api/feedback')
    .then(response => response.json())
    .then(feedbacks => {
      feedbacks.forEach(feedback => {
        const existing = notificationsData.find(n => n.id === feedback.id);
        if (!existing) {
          const time = new Date(feedback.timestamp).toLocaleDateString() + ' • ' + new Date(feedback.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          notificationsData.unshift({
            id: feedback.id,
            category: "Feedback",
            title: "Parent Feedback",
            message: feedback.message,
            time: time,
            read: feedback.read
          });
        }
      });
      renderNotifications();
    })
    .catch(error => console.error('Error loading feedback:', error));
}

function getCategoryClass(category) {
  return `${category.toLowerCase()}-pill`;
}

function updateUnreadBadge() {
  const unreadCount = notificationsData.filter(item => !item.read).length;
  unreadCountBadge.textContent = unreadCount;
}

function renderNotifications() {
  notificationList.innerHTML = "";

  const filteredNotifications = activeTab === "All"
    ? notificationsData
    : notificationsData.filter(item => item.category === activeTab);

  if (filteredNotifications.length === 0) {
    notificationList.innerHTML = `
      <div class="empty-box">
        No notifications found in this category.
      </div>
    `;
    updateUnreadBadge();
    return;
  }

  filteredNotifications.forEach((item) => {
    const div = document.createElement("div");
    div.className = `notification-item ${item.read ? "" : "unread"}`;

    div.innerHTML = `
      <div class="notification-left">
        <div class="notification-top">
          <h4 class="notification-title">${item.title}</h4>
          <span class="category-pill ${getCategoryClass(item.category)}">${item.category}</span>
        </div>
        <p class="notification-message">${item.message}</p>
        <p class="notification-time">${item.time}</p>
      </div>

      <div class="notification-right">
        <button class="action-btn read-btn" onclick="toggleRead(${item.id})">
          ${item.read ? "Mark as Unread" : "Mark as Read"}
        </button>
        <button class="action-btn delete-btn" onclick="deleteNotification(${item.id})">
          Delete
        </button>
      </div>
    `;

    notificationList.appendChild(div);
  });

  updateUnreadBadge();
}

function setActiveTab(tabName, button) {
  activeTab = tabName;

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");
  renderNotifications();
}

function toggleRead(id) {
  const notification = notificationsData.find(item => item.id === id);
  if (notification) {
    notification.read = !notification.read;
    renderNotifications();

    // If it's feedback, update server
    if (notification.category === 'Feedback') {
      fetch(`/api/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: notification.read }),
      }).catch(error => console.error('Error updating feedback:', error));
    }
  }
}

function deleteNotification(id) {
  const notification = notificationsData.find(item => item.id === id);
  notificationsData = notificationsData.filter(item => item.id !== id);
  renderNotifications();

  // If it's feedback, delete from server
  if (notification && notification.category === 'Feedback') {
    fetch(`/api/feedback/${id}`, {
      method: 'DELETE',
    }).catch(error => console.error('Error deleting feedback:', error));
  }
}

function clearAllNotifications() {
  const confirmClear = confirm("Are you sure you want to clear all notifications?");
  if (!confirmClear) return;

  notificationsData = [];
  renderNotifications();
}

renderNotifications();
loadFeedback();