document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categoryFilter = document.getElementById("categoryFilter");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeModalBtn = document.getElementById("closeModalBtn");

  const messageBox = document.getElementById("messageBox");
  const notificationBtn = document.getElementById("notificationBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const readMoreButtons = document.querySelectorAll(".read-more-btn");
  const watchButtons = document.querySelectorAll(".watch-btn");
  const saveButtons = document.querySelectorAll(".save-btn");

  const allCards = document.querySelectorAll(
    "#tipsContainer .guide-card, #videosContainer .video-card, #activitiesContainer .activity-item"
  );

  const detailMap = {
    "How to Teach Counting at Home":
      "Use daily objects like spoons, fruits, pencils, or toys. Ask your child to count them aloud, group them, and compare which set is bigger or smaller.",
    "Fun English Learning Games":
      "Try picture-word matching, alphabet cards, simple rhymes, and sound recognition games to make English learning enjoyable at home.",
    "Build a Daily Learning Habit":
      "Keep learning short, regular, and positive. Even 10 minutes every day can help your child develop consistency and confidence.",
    "Counting Through Daily Objects":
      "This short video explains how parents can turn routine home moments into simple number practice sessions.",
    "Phonics Practice for Beginners":
      "This video helps parents understand how to introduce letter sounds in a fun and stress-free way.",
    "Encouraging Children with Praise":
      "This video shows how positive reinforcement improves participation, confidence, and learning interest.",
    "Alphabet Hunt Game":
      "Choose one alphabet and ask your child to find items around the house that start with that letter.",
    "Count and Sort Toys":
      "Ask your child to count toys and sort them by size, shape, or color for better number understanding.",
    "Word and Picture Match":
      "Write simple words on flash cards and ask your child to match them with pictures."
  };

  function showMessage(message) {
    messageBox.textContent = message;
    setTimeout(() => {
      messageBox.textContent = "";
    }, 2500);
  }

  function openModal(title) {
    modalTitle.textContent = title;
    modalContent.textContent = detailMap[title] || "More details coming soon.";
    modalOverlay.classList.add("active");
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
  }

  function filterCards() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    allCards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category;

      const matchesSearch = title.includes(searchText);
      const matchesCategory =
        selectedCategory === "all" || selectedCategory === category;

      if (matchesSearch && matchesCategory) {
        card.classList.remove("hidden-card");
      } else {
        card.classList.add("hidden-card");
      }
    });
  }

  searchBtn.addEventListener("click", filterCards);
  searchInput.addEventListener("keyup", filterCards);
  categoryFilter.addEventListener("change", filterCards);

  readMoreButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".guide-card");
      const title = card.dataset.title;
      openModal(title);
    });
  });

  watchButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".video-card");
      const title = card.dataset.title;
      openModal(title);
    });
  });

  saveButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const card = e.target.closest(".activity-item");
      const title = card.dataset.title;
      showMessage(`Saved activity: ${title}`);
    });
  });

  closeModalBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
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