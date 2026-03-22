const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navActions = document.querySelector(".nav-actions");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  navActions.classList.toggle("show");
});

// Smooth reveal effect on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

const animatedSections = document.querySelectorAll(
  ".feature-card, .step-card, .benefit-item, .benefit-box, .cta-box"
);

animatedSections.forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(30px)";
  item.style.transition = "all 0.7s ease";
  observer.observe(item);
});