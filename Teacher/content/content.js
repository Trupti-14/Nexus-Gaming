const contentForm = document.getElementById("contentForm");
const contentTableBody = document.getElementById("contentTableBody");
const searchTitle = document.getElementById("searchTitle");
const filterStandard = document.getElementById("filterStandard");
const filterSubject = document.getElementById("filterSubject");
const submitBtn = document.getElementById("submitBtn");
const standardSelect = document.getElementById("standard");
const subjectSelect = document.getElementById("subject");
const chapterSelect = document.getElementById("chapter");
const syllabusPreview = document.getElementById("syllabusPreview");

const DASHBOARD_ACTIVITY_KEY = "teacherRecentActivities";

function getDashboardActivities() {
  try {
    const raw = localStorage.getItem(DASHBOARD_ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function storeDashboardActivities(activities) {
  try {
    localStorage.setItem(DASHBOARD_ACTIVITY_KEY, JSON.stringify(activities));
  } catch (e) {
    // ignore storage errors
  }
}

function addDashboardActivity(title, detail, status) {
  const activities = getDashboardActivities();
  activities.unshift({ title, detail, status });
  storeDashboardActivities(activities.slice(0, 10));
}

let editIndex = -1;

const syllabusData = {
  LKG: {
    English: [
      "Alphabet Learning",
      "Vocabulary Development",
      "Rhymes and Speaking Skills"
    ],
    Maths: [
      "Number Recognition",
      "Shapes and Patterns",
      "Basic Concepts"
    ]
  },
  UKG: {
    English: [
      "Reading and Phonics",
      "Vocabulary and Sentences",
      "Writing Skills"
    ],
    Maths: [
      "Numbers and Counting",
      "Basic Operations",
      "Shapes and Measurement"
    ]
  },
  "1st": {
    English: [
      "Reading Skills",
      "Vocabulary and Grammar",
      "Writing Skills"
    ],
    Maths: [
      "Numbers and Counting",
      "Basic Operations",
      "Shapes and Measurement"
    ]
  }
};

const syllabusDescriptions = {
  LKG: {
    English: [
      "Recognition and writing of A–Z letters, letter sounds, and matching letters with pictures.",
      "Learning simple words related to fruits, animals, colors, body parts, and everyday objects.",
      "Learning simple English rhymes and speaking basic sentences like greetings and self-introduction."
    ],
    Maths: [
      "Learning numbers 1–20, counting objects, and writing numbers.",
      "Identifying basic shapes like circle, square, triangle, rectangle and simple patterns.",
      "Understanding concepts like big–small, more–less, up–down, near–far, inside–outside."
    ]
  },
  UKG: {
    English: [
      "Learning letter sounds, blending sounds, and reading simple words like cat, bat, pen.",
      "Learning new words and making simple sentences like 'This is a dog.'",
      "Writing small and capital letters, simple words, and short sentences."
    ],
    Maths: [
      "Recognizing and writing numbers 1–100, counting objects, and number names.",
      "Simple addition and subtraction using objects or pictures.",
      "Identifying shapes and understanding concepts like long–short, heavy–light, before–after."
    ]
  },
  "1st": {
    English: [
      "Reading simple words, short sentences, and small stories with correct pronunciation.",
      "Learning new words, naming words (nouns), simple verbs, and making basic sentences.",
      "Writing words, simple sentences, and short paragraphs with correct spelling."
    ],
    Maths: [
      "Reading and writing numbers 1–100, counting objects, and number names.",
      "Simple addition and subtraction with numbers and word problems.",
      "Identifying basic shapes and understanding concepts like long–short, heavy–light, before–after."
    ]
  }
};

let contentData = [
  {
    title: "LKG Alphabet Notes",
    standard: "LKG",
    subject: "English",
    chapter: "Alphabet Learning",
    type: "Notes",
    description: "Basic alphabet recognition notes.",
    link: "",
    uploadDate: "2026-03-12",
    status: "Published"
  },
  {
    title: "UKG Addition Video",
    standard: "UKG",
    subject: "Maths",
    chapter: "Basic Operations",
    type: "Video",
    description: "Simple addition and subtraction using objects.",
    link: "https://example.com/video",
    uploadDate: "2026-03-11",
    status: "Draft"
  },
  {
    title: "1st Reading Skills PDF",
    standard: "1st",
    subject: "English",
    chapter: "Reading Skills",
    type: "PDF",
    description: "Short reading practice sheet.",
    link: "",
    uploadDate: "2026-03-10",
    status: "Published"
  }
];

function updateChapterOptions() {
  const standard = standardSelect.value;
  const subject = subjectSelect.value;

  chapterSelect.innerHTML = `<option value="">Select Topic</option>`;

  if (!standard || !subject) {
    syllabusPreview.innerHTML = "Select standard and subject to see major topics.";
    return;
  }

  const topics = syllabusData[standard][subject];
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    chapterSelect.appendChild(option);
  });

  renderSyllabusPreview(standard, subject);
}

function renderSyllabusPreview(standard, subject) {
  const topics = syllabusData[standard][subject];
  const descriptions = syllabusDescriptions[standard][subject];

  syllabusPreview.innerHTML = "";

  topics.forEach((topic, index) => {
    const div = document.createElement("div");
    div.className = "syllabus-item";
    div.innerHTML = `<strong>${topic}</strong>${descriptions[index]}`;
    syllabusPreview.appendChild(div);
  });
}

function renderTable(data = contentData) {
  contentTableBody.innerHTML = "";

  if (data.length === 0) {
    contentTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No content found.</td>
      </tr>
    `;
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.standard === "1st" ? "1st Standard" : item.standard}</td>
      <td>${item.subject}</td>
      <td>${item.chapter}</td>
      <td>${item.type}</td>
      <td>${item.uploadDate}</td>
      <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="table-btn preview-btn" onclick="previewContent(${index})">Preview</button>
          <button class="table-btn edit-btn" onclick="editContent(${index})">Edit</button>
          <button class="table-btn delete-btn" onclick="deleteContent(${index})">Delete</button>
          <button class="table-btn preview-btn" onclick="toggleStatus(${index})">
            ${item.status === "Published" ? "Make Draft" : "Publish"}
          </button>
        </div>
      </td>
    `;

    contentTableBody.appendChild(row);
  });
}

contentForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const standard = document.getElementById("standard").value;
  const subject = document.getElementById("subject").value;
  const chapter = document.getElementById("chapter").value;
  const contentType = document.getElementById("contentType").value;
  const topicTitle = document.getElementById("topicTitle").value.trim();
  const description = document.getElementById("description").value.trim();
  const videoLink = document.getElementById("videoLink").value.trim();
  const publishStatus = document.getElementById("publishStatus").value;

  if (!standard || !subject || !chapter || !topicTitle) {
    alert("Please fill Standard, Subject, Topic, and Content Title.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const newContent = {
    title: topicTitle,
    standard,
    subject,
    chapter,
    type: contentType,
    description,
    link: videoLink,
    uploadDate: today,
    status: publishStatus
  };

  if (editIndex === -1) {
    contentData.push(newContent);
    addDashboardActivity(
      `Content uploaded: ${topicTitle}`,
      `${standard} • ${subject} • ${chapter}`,
      publishStatus
    );
    alert("Content uploaded successfully!");
  } else {
    contentData[editIndex] = newContent;
    addDashboardActivity(
      `Content updated: ${topicTitle}`,
      `${standard} • ${subject} • ${chapter}`,
      publishStatus
    );
    alert("Content updated successfully!");
    editIndex = -1;
    submitBtn.textContent = "Upload Content";
  }

  contentForm.reset();
  chapterSelect.innerHTML = `<option value="">Select Topic</option>`;
  syllabusPreview.innerHTML = "Select standard and subject to see major topics.";
  renderTable();
});

function editContent(index) {
  const item = contentData[index];

  document.getElementById("standard").value = item.standard;
  document.getElementById("subject").value = item.subject;
  updateChapterOptions();
  document.getElementById("chapter").value = item.chapter;
  document.getElementById("contentType").value = item.type;
  document.getElementById("topicTitle").value = item.title;
  document.getElementById("description").value = item.description;
  document.getElementById("videoLink").value = item.link;
  document.getElementById("publishStatus").value = item.status;

  editIndex = index;
  submitBtn.textContent = "Update Content";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteContent(index) {
  const confirmDelete = confirm("Are you sure you want to delete this content?");
  if (!confirmDelete) return;

  contentData.splice(index, 1);
  renderTable();
}

function previewContent(index) {
  const item = contentData[index];
  alert(
    `Title: ${item.title}
Standard: ${item.standard === "1st" ? "1st Standard" : item.standard}
Subject: ${item.subject}
Topic: ${item.chapter}
Type: ${item.type}
Description: ${item.description}
Link: ${item.link || "No link"}
Status: ${item.status}`
  );
}

function toggleStatus(index) {
  contentData[index].status =
    contentData[index].status === "Published" ? "Draft" : "Published";
  renderTable();
}

function resetFormData() {
  contentForm.reset();
  editIndex = -1;
  submitBtn.textContent = "Upload Content";
  chapterSelect.innerHTML = `<option value="">Select Topic</option>`;
  syllabusPreview.innerHTML = "Select standard and subject to see major topics.";
}

function applyFilters() {
  const searchValue = searchTitle.value.toLowerCase();
  const standardValue = filterStandard.value;
  const subjectValue = filterSubject.value;

  const filteredData = contentData.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(searchValue);
    const matchesStandard = standardValue === "" || item.standard === standardValue;
    const matchesSubject = subjectValue === "" || item.subject === subjectValue;
    return matchesTitle && matchesStandard && matchesSubject;
  });

  renderTable(filteredData);
}

standardSelect.addEventListener("change", updateChapterOptions);
subjectSelect.addEventListener("change", updateChapterOptions);

searchTitle.addEventListener("input", applyFilters);
filterStandard.addEventListener("change", applyFilters);
filterSubject.addEventListener("change", applyFilters);

renderTable();