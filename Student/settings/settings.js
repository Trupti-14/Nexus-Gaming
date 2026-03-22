document.getElementById("saveBtn").addEventListener("click", () => {
  alert("Settings saved successfully!");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Logout clicked.");
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete your account?");
  if (confirmDelete) {
    alert("Delete account clicked.");
  }
});