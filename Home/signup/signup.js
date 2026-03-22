const signupForm = document.getElementById("signupForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const formMessage = document.getElementById("formMessage");

const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const roleError = document.getElementById("roleError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const targetInput = document.getElementById(targetId);

    const isPassword = targetInput.type === "password";
    targetInput.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
  });
});

function validateEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
}

function validatePhone(value) {
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(value);
}

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

function updateStrengthIndicator(password) {
  const score = getPasswordStrength(password);

  if (password.length === 0) {
    strengthBar.style.width = "0%";
    strengthBar.style.background = "var(--danger)";
    strengthText.textContent = "Password strength";
    return;
  }

  if (score <= 2) {
    strengthBar.style.width = "35%";
    strengthBar.style.background = "var(--danger)";
    strengthText.textContent = "Weak password";
  } else if (score === 3 || score === 4) {
    strengthBar.style.width = "70%";
    strengthBar.style.background = "var(--warning)";
    strengthText.textContent = "Medium password";
  } else {
    strengthBar.style.width = "100%";
    strengthBar.style.background = "var(--success)";
    strengthText.textContent = "Strong password";
  }
}

passwordInput.addEventListener("input", () => {
  updateStrengthIndicator(passwordInput.value.trim());
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fullNameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
  roleError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const fullNameValue = fullNameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const phoneValue = phoneInput.value.trim();
  const passwordValue = passwordInput.value.trim();
  const confirmPasswordValue = confirmPasswordInput.value.trim();
  const selectedRole = document.querySelector('input[name="role"]:checked');

  let isValid = true;

  if (fullNameValue === "") {
    fullNameError.textContent = "Please enter your full name.";
    isValid = false;
  } else if (fullNameValue.length < 3) {
    fullNameError.textContent = "Full name must be at least 3 characters.";
    isValid = false;
  }

  if (emailValue === "") {
    emailError.textContent = "Please enter your email.";
    isValid = false;
  } else if (!validateEmail(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (phoneValue !== "" && !validatePhone(phoneValue)) {
    phoneError.textContent = "Phone number must be 10 digits.";
    isValid = false;
  }

  if (!selectedRole) {
    roleError.textContent = "Please select your role.";
    isValid = false;
  }

  if (passwordValue === "") {
    passwordError.textContent = "Please create a password.";
    isValid = false;
  } else if (passwordValue.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    isValid = false;
  }

  if (confirmPasswordValue === "") {
    confirmPasswordError.textContent = "Please confirm your password.";
    isValid = false;
  } else if (passwordValue !== confirmPasswordValue) {
    confirmPasswordError.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  formMessage.textContent = "Account created successfully! Redirecting to login...";
  formMessage.classList.add("success");

  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1500);
});