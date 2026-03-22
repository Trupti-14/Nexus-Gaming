const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const formMessage = document.getElementById("formMessage");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const roleError = document.getElementById("roleError");

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Hide" : "Show";
});

function validateEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";
  roleError.textContent = "";
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const selectedRole = document.querySelector('input[name="role"]:checked');

  let isValid = true;

  if (emailValue === "") {
    emailError.textContent = "Please enter your email or username.";
    isValid = false;
  } else if (emailValue.includes("@") && !validateEmail(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (passwordValue === "") {
    passwordError.textContent = "Please enter your password.";
    isValid = false;
  } else if (passwordValue.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    isValid = false;
  }

  if (!selectedRole) {
    roleError.textContent = "Please select your role.";
    isValid = false;
  }

  if (!isValid) return;

  // Store logged-in role (for future use in dashboards)
  const role = selectedRole.value;
  const redirectPaths = {
    student: "../../Student/dashboard/dashboard.html",
    teacher: "../../Teacher/dashboard/dashboard.html",
    parent: "../../Parent/dashboard/dashboard.html"
  };

  // Save basic session info (simple demo mechanism)
  localStorage.setItem("nexusRole", role);
  localStorage.setItem("nexusUserEmail", emailValue);

  formMessage.textContent = "Login successful! Redirecting...";
  formMessage.classList.add("success");

  setTimeout(() => {
    window.location.href = redirectPaths[role];
  }, 800);
});