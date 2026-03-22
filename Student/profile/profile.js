const defaultStudentProfile = {
  name: "Aryan45",
  fullName: "Aryan Sharma",
  email: "aryan45@gmail.com",
  mobile: "9876543210",
  dob: "2018-06-12",
  gender: "Male",
  className: "Grade 1 Student",
  classStandard: "Grade 1",
  school: "Sunrise Kids School",
  favoriteSubject: "Maths",
  avatar: "A",
  stars: 120,
  badges: 8,
  rank: 12,
  streak: 5
};

let isEditMode = false;

function getProfileData() {
  const savedUser = JSON.parse(localStorage.getItem("currentUser"));
  const savedProfile = JSON.parse(localStorage.getItem("studentProfile"));

  return {
    ...defaultStudentProfile,
    ...(savedUser || {}),
    ...(savedProfile || {})
  };
}

function loadProfile() {
  const student = getProfileData();

  document.getElementById("topStudentName").textContent = student.name || student.fullName || "Aryan45";
  document.getElementById("topStudentClass").textContent = student.className || "Grade 1 Student";
  document.getElementById("topAvatar").textContent = (student.avatar || student.name?.charAt(0) || "A").toUpperCase();

  document.getElementById("profileAvatar").textContent = (student.avatar || student.name?.charAt(0) || "A").toUpperCase();
  document.getElementById("profileName").textContent = student.name || student.fullName || "Aryan45";
  document.getElementById("profileClass").textContent = student.classStandard || "Grade 1";
  document.getElementById("profileSchool").textContent = student.school || "Sunrise Kids School";

  document.getElementById("welcomeName");

  document.getElementById("fullName").value = student.fullName || "";
  document.getElementById("email").value = student.email || "";
  document.getElementById("mobile").value = student.mobile || "";
  document.getElementById("dob").value = student.dob || "";
  document.getElementById("gender").value = student.gender || "";

  document.getElementById("studentClassInput").value = student.classStandard || "";
  document.getElementById("school").value = student.school || "";
  document.getElementById("favoriteSubject").value = student.favoriteSubject || "";

  document.getElementById("starsEarned").textContent = student.stars || 0;
  document.getElementById("badgesCount").textContent = student.badges || 0;
  document.getElementById("rankValue").textContent = student.rank || 0;
  document.getElementById("streakValue").textContent = student.streak || 0;
}

function setEditMode(enabled) {
  isEditMode = enabled;

  const fields = [
    document.getElementById("fullName"),
    document.getElementById("email"),
    document.getElementById("mobile"),
    document.getElementById("dob"),
    document.getElementById("gender"),
    document.getElementById("studentClassInput"),
    document.getElementById("school"),
    document.getElementById("favoriteSubject")
  ];

  fields.forEach(field => {
    field.disabled = !enabled;
  });
}

function saveProfile() {
  const current = getProfileData();

  const updatedProfile = {
    ...current,
    name: document.getElementById("fullName").value || current.name,
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    mobile: document.getElementById("mobile").value,
    dob: document.getElementById("dob").value,
    gender: document.getElementById("gender").value,
    classStandard: document.getElementById("studentClassInput").value,
    className: document.getElementById("studentClassInput").value + " Student",
    school: document.getElementById("school").value,
    favoriteSubject: document.getElementById("favoriteSubject").value
  };

  localStorage.setItem("studentProfile", JSON.stringify(updatedProfile));
  localStorage.setItem("currentUser", JSON.stringify(updatedProfile));

  alert("Profile saved successfully!");
  setEditMode(false);
  loadProfile();
}

function cancelEdit() {
  setEditMode(false);
  loadProfile();
}

function changeAvatar() {
  const avatars = ["A", "🧒", "👦", "👧", "🌟", "🚀", "🎯", "🦸"];
  const current = getProfileData();
  const currentAvatar = current.avatar || "A";

  let currentIndex = avatars.indexOf(currentAvatar);
  currentIndex = currentIndex === -1 ? 0 : currentIndex;

  const nextAvatar = avatars[(currentIndex + 1) % avatars.length];

  const updated = {
    ...current,
    avatar: nextAvatar
  };

  localStorage.setItem("studentProfile", JSON.stringify(updated));
  localStorage.setItem("currentUser", JSON.stringify(updated));

  loadProfile();
}

document.getElementById("editProfileBtn").addEventListener("click", function () {
  setEditMode(true);
});

document.getElementById("saveBtn").addEventListener("click", function () {
  saveProfile();
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  cancelEdit();
});

document.getElementById("changeAvatarBtn").addEventListener("click", function () {
  changeAvatar();
});

document.getElementById("avatarBtnBottom").addEventListener("click", function () {
  changeAvatar();
});

document.getElementById("notificationBtn").addEventListener("click", function () {
  window.location.href = "notifications.html";
});

loadProfile();
setEditMode(false);