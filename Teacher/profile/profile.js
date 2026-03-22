const editProfileBtn = document.getElementById("editProfileBtn");
const profileImageInput = document.getElementById("profileImageInput");
const profilePreview = document.getElementById("profilePreview");

const editableFields = [
  document.getElementById("fullName"),
  document.getElementById("email"),
  document.getElementById("phone"),
  document.getElementById("gender")
];

let isEditMode = false;

editProfileBtn.addEventListener("click", function () {
  isEditMode = !isEditMode;

  editableFields.forEach((field) => {
    field.disabled = !isEditMode;
  });

  editProfileBtn.innerText = isEditMode ? "Cancel Edit" : "Edit Profile";
});

function changePhoto() {
  profileImageInput.click();
}

profileImageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

function saveProfile() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const gender = document.getElementById("gender").value;

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (fullName === "" || email === "" || phone === "") {
    alert("Please fill all personal information fields.");
    return;
  }

  if (newPassword !== "" || confirmPassword !== "" || currentPassword !== "") {
    if (currentPassword === "" || newPassword === "" || confirmPassword === "") {
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

  document.getElementById("displayName").innerText = fullName;

  editableFields.forEach((field) => {
    field.disabled = true;
  });

  isEditMode = false;
  editProfileBtn.innerText = "Edit Profile";

  alert("Profile updated successfully!");
}