const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navActions = document.querySelector(".nav-actions");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  navActions.classList.toggle("show");
});

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

const animatedItems = document.querySelectorAll(
  ".mission-card, .problem-card, .role-card, .project-card, .solution-content, .solution-box, .vision-box, .cta-box"
);

animatedItems.forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(30px)";
  item.style.transition = "all 0.7s ease";
  observer.observe(item);
});