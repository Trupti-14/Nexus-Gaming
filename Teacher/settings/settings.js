function saveSettings() {
  const username = document.getElementById("teacherUsername").value.trim();
  const email = document.getElementById("teacherEmail").value.trim();
  const phone = document.getElementById("teacherPhone").value.trim();

  const currentPassword = document.getElementById("currentPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const profileVisibility = document.getElementById("profileVisibility").value;
  const activityTracking = document.getElementById("activityTracking").value;
  const dataSharing = document.getElementById("dataSharing").value;
  const themeSelector = document.getElementById("themeSelector").value;
  const languageSelector = document.getElementById("languageSelector").value;

  const emailNotifications = document.getElementById("emailNotifications").checked;
  const assignmentAlerts = document.getElementById("assignmentAlerts").checked;
  const quizNotifications = document.getElementById("quizNotifications").checked;
  const studentMessages = document.getElementById("studentMessages").checked;

  if (!username || !email || !phone) {
    alert("Please fill all account settings fields.");
    return;
  }

  if (newPassword || confirmPassword || currentPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
  }

  const settingsData = {
    username,
    email,
    phone,
    profileVisibility,
    activityTracking,
    dataSharing,
    themeSelector,
    languageSelector,
    emailNotifications,
    assignmentAlerts,
    quizNotifications,
    studentMessages
  };

  localStorage.setItem("teacherSettings", JSON.stringify(settingsData));

  alert("Settings saved successfully!");
}

function logoutUser() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  alert("Logged out successfully!");
  // window.location.href = "../../login/login.html";
}

function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem("teacherSettings"));

  if (!savedSettings) return;

  document.getElementById("teacherUsername").value = savedSettings.username || "";
  document.getElementById("teacherEmail").value = savedSettings.email || "";
  document.getElementById("teacherPhone").value = savedSettings.phone || "";

  document.getElementById("profileVisibility").value = savedSettings.profileVisibility || "Public";
  document.getElementById("activityTracking").value = savedSettings.activityTracking || "Enabled";
  document.getElementById("dataSharing").value = savedSettings.dataSharing || "Allowed";
  document.getElementById("themeSelector").value = savedSettings.themeSelector || "Neon Dark";
  document.getElementById("languageSelector").value = savedSettings.languageSelector || "English";

  document.getElementById("emailNotifications").checked = savedSettings.emailNotifications ?? true;
  document.getElementById("assignmentAlerts").checked = savedSettings.assignmentAlerts ?? true;
  document.getElementById("quizNotifications").checked = savedSettings.quizNotifications ?? true;
  document.getElementById("studentMessages").checked = savedSettings.studentMessages ?? false;
}

loadSettings();