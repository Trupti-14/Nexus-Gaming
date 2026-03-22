document.addEventListener("DOMContentLoaded", () => {
  const editProfileBtn = document.getElementById("editProfileBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  const parentName = document.getElementById("parentName");
  const topParentName = document.getElementById("topParentName");
  const parentEmail = document.getElementById("parentEmail");
  const avatarLetter = document.getElementById("avatarLetter");
  const profilePhoto = document.getElementById("profilePhoto");

  const passwordForm = document.getElementById("passwordForm");
  const currentPassword = document.getElementById("currentPassword");
  const newPassword = document.getElementById("newPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  const emailToggle = document.getElementById("emailToggle");
  const appToggle = document.getElementById("appToggle");
  const progressToggle = document.getElementById("progressToggle");

  const notificationBtn = document.getElementById("notificationBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const messageBox = document.getElementById("messageBox");

  let isEditing = false;

  const originalData = {
    fullName: fullName.value,
    email: email.value,
    phone: phone.value
  };

  function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = "message-box";

    if (type === "success") {
      messageBox.classList.add("message-success");
    } else {
      messageBox.classList.add("message-error");
    }

    setTimeout(() => {
      messageBox.textContent = "";
      messageBox.className = "message-box";
    }, 3000);
  }

  function setEditingMode(enabled) {
    isEditing = enabled;
    fullName.disabled = !enabled;
    email.disabled = !enabled;
    phone.disabled = !enabled;

    if (enabled) {
      fullName.focus();
      editProfileBtn.textContent = "Editing...";
      editProfileBtn.disabled = true;
    } else {
      editProfileBtn.textContent = "Edit Profile";
      editProfileBtn.disabled = false;
    }
  }

  editProfileBtn.addEventListener("click", () => {
    setEditingMode(true);
    showMessage("You can now edit parent details.", "success");
  });

  saveChangesBtn.addEventListener("click", () => {
    if (!isEditing) {
      showMessage("Click Edit Profile first to make changes.", "error");
      return;
    }

    if (
      fullName.value.trim() === "" ||
      email.value.trim() === "" ||
      phone.value.trim() === ""
    ) {
      showMessage("Please fill all personal information fields.", "error");
      return;
    }

    parentName.textContent = fullName.value.trim();
    topParentName.textContent = fullName.value.trim();
    parentEmail.textContent = email.value.trim();

    const firstLetter = fullName.value.trim().charAt(0).toUpperCase() || "P";
    avatarLetter.textContent = firstLetter;
    profilePhoto.textContent = firstLetter;

    originalData.fullName = fullName.value;
    originalData.email = email.value;
    originalData.phone = phone.value;

    setEditingMode(false);

    console.log("Saved Profile Data:", {
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      preferences: {
        emailNotifications: emailToggle.checked,
        appNotifications: appToggle.checked,
        progressAlerts: progressToggle.checked
      }
    });

    showMessage("Profile changes saved successfully.", "success");
  });

  cancelBtn.addEventListener("click", () => {
    fullName.value = originalData.fullName;
    email.value = originalData.email;
    phone.value = originalData.phone;

    setEditingMode(false);
    showMessage("Changes cancelled.", "error");
  });

  passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
      currentPassword.value.trim() === "" ||
      newPassword.value.trim() === "" ||
      confirmPassword.value.trim() === ""
    ) {
      showMessage("Please fill all password fields.", "error");
      return;
    }

    if (newPassword.value.length < 6) {
      showMessage("New password must be at least 6 characters.", "error");
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      showMessage("New password and confirm password do not match.", "error");
      return;
    }

    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    showMessage("Password updated successfully.", "success");
  });

  changePasswordBtn.addEventListener("click", () => {
    document.getElementById("currentPassword").focus();
    showMessage("Enter password details below.", "success");
  });

  emailToggle.addEventListener("change", () => {
    console.log("Email notifications:", emailToggle.checked);
  });

  appToggle.addEventListener("change", () => {
    console.log("App notifications:", appToggle.checked);
  });

  progressToggle.addEventListener("change", () => {
    console.log("Progress alerts:", progressToggle.checked);
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
});

function goToProfile() {
  window.location.href = "../profile/profile.html";
}