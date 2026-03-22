document.addEventListener("DOMContentLoaded", () => {
  const parentEmail = document.getElementById("parentEmail");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  const progressAlerts = document.getElementById("progressAlerts");
  const dailySummary = document.getElementById("dailySummary");
  const achievementNotifications = document.getElementById("achievementNotifications");

  const dailyReminderToggle = document.getElementById("dailyReminderToggle");
  const reminderTime = document.getElementById("reminderTime");

  const gameAccess = document.getElementById("gameAccess");
  const practiceAccess = document.getElementById("practiceAccess");
  const lateNightRestriction = document.getElementById("lateNightRestriction");

  const dataSharingToggle = document.getElementById("dataSharingToggle");
  const accountSecurityToggle = document.getElementById("accountSecurityToggle");

  const saveSettingsBtn = document.getElementById("saveSettingsBtn");
  const resetSettingsBtn = document.getElementById("resetSettingsBtn");

  const notificationBtn = document.getElementById("notificationBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const messageBox = document.getElementById("messageBox");

  const defaultValues = {
    parentEmail: "mrs.sharma@gmail.com",
    progressAlerts: true,
    dailySummary: true,
    achievementNotifications: true,
    dailyReminderToggle: true,
    reminderTime: "18:00",
    gameAccess: true,
    practiceAccess: true,
    lateNightRestriction: false,
    dataSharingToggle: false,
    accountSecurityToggle: true
  };

  function showMessage(message, isError = false) {
    messageBox.textContent = message;
    messageBox.style.color = isError ? "#ff5f7a" : "#31ff9f";

    setTimeout(() => {
      messageBox.textContent = "";
    }, 3000);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function resetForm() {
    parentEmail.value = defaultValues.parentEmail;
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    progressAlerts.checked = defaultValues.progressAlerts;
    dailySummary.checked = defaultValues.dailySummary;
    achievementNotifications.checked = defaultValues.achievementNotifications;

    dailyReminderToggle.checked = defaultValues.dailyReminderToggle;
    reminderTime.value = defaultValues.reminderTime;

    gameAccess.checked = defaultValues.gameAccess;
    practiceAccess.checked = defaultValues.practiceAccess;
    lateNightRestriction.checked = defaultValues.lateNightRestriction;

    dataSharingToggle.checked = defaultValues.dataSharingToggle;
    accountSecurityToggle.checked = defaultValues.accountSecurityToggle;

    reminderTime.disabled = !dailyReminderToggle.checked;
  }

  dailyReminderToggle.addEventListener("change", () => {
    reminderTime.disabled = !dailyReminderToggle.checked;
  });

  saveSettingsBtn.addEventListener("click", () => {
    const emailValue = parentEmail.value.trim();
    const currentPasswordValue = currentPassword.value.trim();
    const newPasswordValue = newPassword.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if (!validateEmail(emailValue)) {
      showMessage("Please enter a valid email address.", true);
      return;
    }

    const passwordFieldsFilled =
      currentPasswordValue || newPasswordValue || confirmPasswordValue;

    if (passwordFieldsFilled) {
      if (!currentPasswordValue || !newPasswordValue || !confirmPasswordValue) {
        showMessage("Please fill all password fields to change password.", true);
        return;
      }

      if (newPasswordValue.length < 6) {
        showMessage("New password must be at least 6 characters.", true);
        return;
      }

      if (newPasswordValue !== confirmPasswordValue) {
        showMessage("New password and confirm password do not match.", true);
        return;
      }
    }

    const settingsData = {
      email: emailValue,
      notifications: {
        progressAlerts: progressAlerts.checked,
        dailySummary: dailySummary.checked,
        achievementNotifications: achievementNotifications.checked
      },
      reminders: {
        dailyReminder: dailyReminderToggle.checked,
        reminderTime: reminderTime.value
      },
      childAccess: {
        gameAccess: gameAccess.checked,
        practiceAccess: practiceAccess.checked,
        lateNightRestriction: lateNightRestriction.checked
      },
      privacy: {
        dataSharing: dataSharingToggle.checked,
        accountSecurity: accountSecurityToggle.checked
      }
    };

    console.log("Saved Settings:", settingsData);

    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    showMessage("Settings saved successfully.");
  });

  resetSettingsBtn.addEventListener("click", () => {
    resetForm();
    showMessage("Settings reset successfully.");
  });

  notificationBtn.addEventListener("click", () => {
  window.location.href = "../notifications/notifications.html";
});

settingsBtn.addEventListener("click", () => {
  window.location.href = "settings.html";
});

  logoutBtn.addEventListener("click", () => {
    alert("Logout successful.");
  });

  resetForm();
});

function goToProfile() {
  window.location.href = "../profile/profile.html";
}