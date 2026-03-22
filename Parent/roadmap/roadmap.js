// Roadmap JavaScript for Parent Dashboard

document.addEventListener("DOMContentLoaded", () => {
  loadChildren();
  loadRoadmap();
  loadGoals();
});

// Sample data - in real app, this would come from API
const childrenData = [
  { id: 1, name: "Aarav Sharma", grade: "6th-C", avatar: "A" },
  { id: 2, name: "Diya Sharma", grade: "4th-A", avatar: "D" }
];

const roadmapData = {
  1: { // Aarav's roadmap
    completedMilestones: 12,
    currentLevel: 3,
    nextMilestoneDays: 5,
    milestones: [
      {
        id: 1,
        title: "English Poems",
        description: "Learn to identify Figures of Speech",
        status: "completed",
        date: "2026-02-15"
      },
      {
        id: 2,
        title: "Geography",
        description: "The Universe and Solar System, Land and Oceans, Resources, Asia and Europe, Globe, Understanding Disaster.",
        status: "completed",
        date: "2026-02-20"
      },
      {
        id: 3,
        title: "Science",
        description: " Measurements, Forces and Motion, Matter Around Us, The Living World of Plants, Living World of Animals, Health and Hygiene, Computer Introduction.",
        status: "current",
        date: "2026-03-13"
      },
      {
        id: 4,
        title: "Mathematics ",
        description: "Numbers, Introduction to Algebra, Ratio and Proportion, Geometry, Statistics, Information Processing.",
        status: "upcoming",
        date: "2026-03-20"
      },
      {
        id: 5,
        title: "Simple Words",
        description: "Read and write basic 3-letter words",
        status: "upcoming",
        date: "2026-03-25"
      }
    ]
  },
  2: { // Diya's roadmap
    completedMilestones: 18,
    currentLevel: 5,
    nextMilestoneDays: 3,
    milestones: [
      {
        id: 1,
        title: "Advanced Phonics",
        description: "Master vowel sounds and consonant blends",
        status: "completed",
        date: "2026-02-10"
      },
      {
        id: 2,
        title: "Basic Sentences",
        description: "Construct and read simple sentences",
        status: "completed",
        date: "2026-02-18"
      },
      {
        id: 3,
        title: "Number Operations",
        description: "Addition and subtraction up to 50",
        status: "current",
        date: "2026-03-13"
      },
      {
        id: 4,
        title: "Story Comprehension",
        description: "Read short stories and answer questions",
        status: "upcoming",
        date: "2026-03-18"
      },
      {
        id: 5,
        title: "Basic Geography",
        description: "Learn about continents and basic maps",
        status: "upcoming",
        date: "2026-03-22"
      }
    ]
  }
};

let currentChildId = 1;

function loadChildren() {
  const childTabs = document.getElementById("childTabs");

  childrenData.forEach(child => {
    const tab = document.createElement("div");
    tab.className = `child-tab ${child.id === currentChildId ? 'active' : ''}`;
    tab.textContent = `${child.name} (${child.grade})`;
    tab.onclick = () => switchChild(child.id);
    childTabs.appendChild(tab);
  });
}

function switchChild(childId) {
  currentChildId = childId;

  // Update active tab
  document.querySelectorAll('.child-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // Reload data for new child
  loadRoadmap();
  loadGoals();
}

function loadRoadmap() {
  const data = roadmapData[currentChildId];
  const timeline = document.getElementById("roadmapTimeline");

  // Update overview stats
  document.getElementById("completedMilestones").textContent = data.completedMilestones;
  document.getElementById("currentLevel").textContent = data.currentLevel;
  document.getElementById("nextMilestone").textContent = data.nextMilestoneDays;

  // Clear existing timeline
  timeline.innerHTML = '';

  // Add milestones to timeline
  data.milestones.forEach(milestone => {
    const item = document.createElement("div");
    item.className = `timeline-item ${milestone.status}`;

    item.innerHTML = `
      <div class="timeline-content">
        <div class="timeline-header">
          <div class="timeline-title">${milestone.title}</div>
          <div class="timeline-status status-${milestone.status}">${milestone.status}</div>
        </div>
        <div class="timeline-desc">${milestone.description}</div>
        <div class="timeline-date">${formatDate(milestone.date)}</div>
      </div>
    `;

    timeline.appendChild(item);
  });
}

function loadGoals() {
  const data = roadmapData[currentChildId];
  const goalsList = document.getElementById("goalsList");

  // Clear existing goals
  goalsList.innerHTML = '';

  // Get upcoming milestones as goals
  const upcomingGoals = data.milestones.filter(m => m.status === 'upcoming').slice(0, 3);

  upcomingGoals.forEach(goal => {
    const goalItem = document.createElement("div");
    goalItem.className = "goal-item";

    goalItem.innerHTML = `
      <div class="goal-icon">🎯</div>
      <div class="goal-content">
        <h4>${goal.title}</h4>
        <p>${goal.description} • Due: ${formatDate(goal.date)}</p>
      </div>
    `;

    goalsList.appendChild(goalItem);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Add some interactive features
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('timeline-content')) {
    // Toggle expanded view
    e.target.classList.toggle('expanded');
  }
});