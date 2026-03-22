const emailInput = document.getElementById("email");
const otpInput = document.getElementById("otp");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const emailError = document.getElementById("emailError");
const otpError = document.getElementById("otpError");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const formMessage = document.getElementById("formMessage");

const emailStep = document.getElementById("emailStep");
const otpStep = document.getElementById("otpStep");
const resetStep = document.getElementById("resetStep");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const backToEmailBtn = document.getElementById("backToEmailBtn");
const backToOtpBtn = document.getElementById("backToOtpBtn");
const forgotForm = document.getElementById("forgotForm");

const toggleButtons = document.querySelectorAll(".toggle-password");

const registeredEmails = [
  "student@nexus.com",
  "teacher@nexus.com",
  "parent@nexus.com"
];

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

function clearMessages() {
  emailError.textContent = "";
  otpError.textContent = "";
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

function showStep(stepToShow) {
  emailStep.classList.remove("active");
  otpStep.classList.remove("active");
  resetStep.classList.remove("active");

  stepToShow.classList.add("active");
}

sendOtpBtn.addEventListener("click", () => {
  clearMessages();

  const emailValue = emailInput.value.trim();

  if (emailValue === "") {
    emailError.textContent = "Please enter your registered email.";
    return;
  }

  if (!validateEmail(emailValue)) {
    emailError.textContent = "Please enter a valid email address.";
    return;
  }

  if (!registeredEmails.includes(emailValue)) {
    emailError.textContent = "This email is not registered in the system.";
    return;
  }

  formMessage.textContent = "OTP sent successfully to your email.";
  formMessage.classList.add("success");

  setTimeout(() => {
    formMessage.textContent = "";
    showStep(otpStep);
  }, 900);
});

verifyOtpBtn.addEventListener("click", () => {
  clearMessages();

  const otpValue = otpInput.value.trim();

  if (otpValue === "") {
    otpError.textContent = "Please enter the OTP.";
    return;
  }

  if (otpValue !== "123456") {
    otpError.textContent = "Invalid OTP. Please try again.";
    return;
  }

  formMessage.textContent = "OTP verified successfully.";
  formMessage.classList.add("success");

  setTimeout(() => {
    formMessage.textContent = "";
    showStep(resetStep);
  }, 900);
});

backToEmailBtn.addEventListener("click", () => {
  clearMessages();
  showStep(emailStep);
});

backToOtpBtn.addEventListener("click", () => {
  clearMessages();
  showStep(otpStep);
});

forgotForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  const newPasswordValue = newPasswordInput.value.trim();
  const confirmPasswordValue = confirmPasswordInput.value.trim();

  let isValid = true;

  if (newPasswordValue === "") {
    newPasswordError.textContent = "Please enter your new password.";
    isValid = false;
  } else if (newPasswordValue.length < 6) {
    newPasswordError.textContent = "Password must be at least 6 characters.";
    isValid = false;
  }

  if (confirmPasswordValue === "") {
    confirmPasswordError.textContent = "Please confirm your password.";
    isValid = false;
  } else if (newPasswordValue !== confirmPasswordValue) {
    confirmPasswordError.textContent = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  formMessage.textContent = "Password reset successful! Redirecting to login...";
  formMessage.classList.add("success");

  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1500);
});