document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedbackForm");

  const feedbackInput = document.getElementById("feedbackInput");

  const feedbackMessage = document.getElementById("feedbackMessage");

  const notificationBtn = document.getElementById("notificationBtn");

  const settingsBtn = document.getElementById("settingsBtn");

  feedbackForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const feedbackText = feedbackInput.value.trim();

    if (feedbackText === "") 
    {
      feedbackMessage.style.color = "#ff5f7a";
      feedbackMessage.textContent = "Please enter feedback before sending.";
      return;
    }

    // Send feedback to server
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: feedbackText }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        feedbackMessage.style.color = "#31ff9f";
        feedbackMessage.textContent = "Feedback sent successfully to the teacher.";
        feedbackInput.value = "";
        setTimeout(() => {
          feedbackMessage.textContent = "";
        }, 3000);
      } else {
        feedbackMessage.style.color = "#ff5f7a";
        feedbackMessage.textContent = "Failed to send feedback. Please try again.";
      }
    })
    .catch(error => {
      console.error('Error:', error);
      feedbackMessage.style.color = "#ff5f7a";
      feedbackMessage.textContent = "Failed to send feedback. Please try again.";
    });
  });

  notificationBtn.addEventListener("click", () => {
    window.location.href = "../notifications/notifications.html";
  });

  settingsBtn.addEventListener("click", () => {
    window.location.href = "../settings/settings.html";
  });

  document.querySelectorAll(".view-progress-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.location.href = "../progress/progress.html";
    });
  });
});



/* ADD THIS FUNCTION AT THE BOTTOM */

function goToProfile() {
  window.location.href = "../profile/profile.html";
}