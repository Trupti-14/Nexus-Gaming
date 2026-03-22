const quizModeBtn = document.getElementById("quizModeBtn");
const assignmentModeBtn = document.getElementById("assignmentModeBtn");
const quizSection = document.getElementById("quizSection");
const assignmentSection = document.getElementById("assignmentSection");
const questionsContainer = document.getElementById("questionsContainer");
const savedItemsTableBody = document.getElementById("savedItemsTableBody");

let currentMode = "quiz";
let editIndex = -1;

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

let savedItems = [
  {
    name: "Alphabet Quiz",
    type: "Quiz",
    subject: "English",
    chapter: "Alphabet Learning",
    dueDate: "2026-03-20",
    status: "Published",
    className: "LKG-A",
    instructions: "Answer all questions carefully.",
    timeLimit: "15",
    totalMarks: "20",
    questions: [
      {
        qText: "Which is the letter A?",
        qType: "MCQ",
        answer: "A",
        option1: "A",
        option2: "B",
        option3: "C",
        option4: "D"
      }
    ]
  },
  {
    name: "Basic Operations Homework",
    type: "Assignment",
    subject: "Maths",
    chapter: "Basic Operations",
    dueDate: "2026-03-18",
    status: "Draft",
    className: "UKG-A",
    description: "Complete addition and subtraction practice.",
    attachment: ""
  }
];

function switchMode(mode) {
  currentMode = mode;

  if (mode === "quiz") {
    quizSection.classList.remove("hidden");
    assignmentSection.classList.add("hidden");
    quizModeBtn.classList.add("active");
    assignmentModeBtn.classList.remove("active");
  } else {
    assignmentSection.classList.remove("hidden");
    quizSection.classList.add("hidden");
    assignmentModeBtn.classList.add("active");
    quizModeBtn.classList.remove("active");
  }

  // Ensure date inputs are always usable by forcing focus and showPicker where supported
  const quizDate = document.getElementById("quizDeadline");
  const assignmentDate = document.getElementById("assignmentDueDate");
  if (quizDate) {
    quizDate.disabled = false;
    quizDate.addEventListener("focus", () => {
      if (typeof quizDate.showPicker === "function") {
        quizDate.showPicker();
        return;
      }
      const entered = prompt("Enter due date (YYYY-MM-DD):", quizDate.value || "");
      if (entered && /^\d{4}-\d{2}-\d{2}$/.test(entered)) {
        quizDate.value = entered;
      }
    });
  }
  if (assignmentDate) {
    assignmentDate.disabled = false;
    assignmentDate.addEventListener("focus", () => {
      if (typeof assignmentDate.showPicker === "function") {
        assignmentDate.showPicker();
        return;
      }
      const entered = prompt("Enter due date (YYYY-MM-DD):", assignmentDate.value || "");
      if (entered && /^\d{4}-\d{2}-\d{2}$/.test(entered)) {
        assignmentDate.value = entered;
      }
    });
  }
}

function addQuestionBlock(data = null) {
  const qText = data?.qText || "";
  const qType = data?.qType || "MCQ";
  const answer = data?.answer || "";
  const option1 = data?.option1 || "";
  const option2 = data?.option2 || "";
  const option3 = data?.option3 || "";
  const option4 = data?.option4 || "";

  const block = document.createElement("div");
  block.className = "question-block";

  block.innerHTML = `
    <div class="question-top">
      <div class="form-group">
        <label>Question</label>
        <input type="text" class="q-text" placeholder="Enter question" value="${qText}">
      </div>

      <div class="form-group">
        <label>Type</label>
        <select class="q-type">
          <option value="MCQ" ${qType === "MCQ" ? "selected" : ""}>MCQ</option>
          <option value="True/False" ${qType === "True/False" ? "selected" : ""}>True / False</option>
          <option value="Short Answer" ${qType === "Short Answer" ? "selected" : ""}>Short Answer</option>
        </select>
      </div>

      <div class="form-group">
        <label>Correct Answer</label>
        <input type="text" class="q-answer" placeholder="Correct answer" value="${answer}">
      </div>
    </div>

    <div class="option-grid">
      <div class="form-group">
        <label>Option 1</label>
        <input type="text" class="q-option1" value="${option1}" placeholder="Option 1">
      </div>

      <div class="form-group">
        <label>Option 2</label>
        <input type="text" class="q-option2" value="${option2}" placeholder="Option 2">
      </div>

      <div class="form-group">
        <label>Option 3</label>
        <input type="text" class="q-option3" value="${option3}" placeholder="Option 3">
      </div>

      <div class="form-group">
        <label>Option 4</label>
        <input type="text" class="q-option4" value="${option4}" placeholder="Option 4">
      </div>
    </div>

    <button type="button" class="remove-btn" onclick="removeQuestionBlock(this)">Remove Question</button>
  `;

  questionsContainer.appendChild(block);
}

function removeQuestionBlock(button) {
  button.parentElement.remove();
}

document.getElementById("quizForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("quizTitle").value.trim();
  const subject = document.getElementById("quizSubject").value;
  const chapter = document.getElementById("quizChapter").value;
  const instructions = document.getElementById("quizInstructions").value.trim();
  const timeLimit = document.getElementById("quizTimeLimit").value.trim();
  const totalMarks = document.getElementById("quizMarks").value.trim();
  let dueDate = document.getElementById("quizDeadline").value;
  const className = document.getElementById("quizClass").value;

  if (!dueDate) {
    const today = new Date().toISOString().split("T")[0];
    dueDate = today;
  }

  if (!name || !subject || !chapter || !dueDate || !className) {
    alert("Please fill all required quiz fields.");
    return;
  }

  const blocks = document.querySelectorAll(".question-block");
  if (blocks.length === 0) {
    alert("Please add at least one question.");
    return;
  }

  const questions = [];
  blocks.forEach((block) => {
    questions.push({
      qText: block.querySelector(".q-text").value.trim(),
      qType: block.querySelector(".q-type").value,
      answer: block.querySelector(".q-answer").value.trim(),
      option1: block.querySelector(".q-option1").value.trim(),
      option2: block.querySelector(".q-option2").value.trim(),
      option3: block.querySelector(".q-option3").value.trim(),
      option4: block.querySelector(".q-option4").value.trim()
    });
  });

  const quizItem = {
    name,
    type: "Quiz",
    subject,
    chapter,
    dueDate,
    status: "Draft",
    className,
    instructions,
    timeLimit,
    totalMarks,
    questions
  };

  if (editIndex === -1) {
    savedItems.push(quizItem);
    addDashboardActivity(
      `Quiz created: ${name}`,
      `${subject} • ${chapter}`,
      "Published"
    );
    alert("Quiz saved successfully!");
  } else {
    savedItems[editIndex] = { ...quizItem, status: savedItems[editIndex].status };
    addDashboardActivity(
      `Quiz updated: ${name}`,
      `${subject} • ${chapter}`,
      savedItems[editIndex].status
    );
    alert("Quiz updated successfully!");
    editIndex = -1;
    document.getElementById("quizSubmitBtn").textContent = "Save Quiz";
  }

  resetQuizForm();
  renderSavedItems();
});

document.getElementById("assignmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("assignmentTitle").value.trim();
  const subject = document.getElementById("assignmentSubject").value;
  const chapter = document.getElementById("assignmentChapter").value;
  const description = document.getElementById("assignmentDescription").value.trim();
  let dueDate = document.getElementById("assignmentDueDate").value;
  const className = document.getElementById("assignmentClass").value;

  if (!dueDate) {
    const today = new Date().toISOString().split("T")[0];
    dueDate = today;
  }

  if (!name || !subject || !chapter || !dueDate || !className) {
    alert("Please fill all required assignment fields.");
    return;
  }

  const assignmentItem = {
    name,
    type: "Assignment",
    subject,
    chapter,
    dueDate,
    status: "Draft",
    className,
    description
  };

  if (editIndex === -1) {
    savedItems.push(assignmentItem);
    addDashboardActivity(
      `Assignment created: ${name}`,
      `${subject} • ${chapter}`,
      "Draft"
    );
    alert("Assignment saved successfully!");
  } else {
    savedItems[editIndex] = { ...assignmentItem, status: savedItems[editIndex].status };
    addDashboardActivity(
      `Assignment updated: ${name}`,
      `${subject} • ${chapter}`,
      savedItems[editIndex].status
    );
    alert("Assignment updated successfully!");
    editIndex = -1;
    document.getElementById("assignmentSubmitBtn").textContent = "Save Assignment";
  }

  resetAssignmentForm();
  renderSavedItems();
});

function editItem(index) {
  const item = savedItems[index];
  editIndex = index;

  if (item.type === "Quiz") {
    switchMode("quiz");

    document.getElementById("quizTitle").value = item.name;
    document.getElementById("quizSubject").value = item.subject;
    document.getElementById("quizChapter").value = item.chapter;
    document.getElementById("quizInstructions").value = item.instructions || "";
    document.getElementById("quizTimeLimit").value = item.timeLimit || "";
    document.getElementById("quizMarks").value = item.totalMarks || "";
    document.getElementById("quizDeadline").value = item.dueDate;
    document.getElementById("quizClass").value = item.className;

    questionsContainer.innerHTML = "";
    (item.questions || []).forEach((q) => addQuestionBlock(q));

    document.getElementById("quizSubmitBtn").textContent = "Update Quiz";
  } else {
    switchMode("assignment");

    document.getElementById("assignmentTitle").value = item.name;
    document.getElementById("assignmentSubject").value = item.subject;
    document.getElementById("assignmentChapter").value = item.chapter;
    document.getElementById("assignmentDescription").value = item.description || "";
    document.getElementById("assignmentDueDate").value = item.dueDate;
    document.getElementById("assignmentClass").value = item.className;

    document.getElementById("assignmentSubmitBtn").textContent = "Update Assignment";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteItem(index) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  savedItems.splice(index, 1);
  renderSavedItems();
}

function togglePublish(index) {
  savedItems[index].status =
    savedItems[index].status === "Published" ? "Draft" : "Published";
  renderSavedItems();
}

function viewSubmissions(index) {
  const item = savedItems[index];
  alert(
    `Submissions for: ${item.name}
Type: ${item.type}
Class: ${item.className}
Status: ${item.status}

This can later open a full submissions page.`
  );
}

function renderSavedItems() {
  savedItemsTableBody.innerHTML = "";

  if (savedItems.length === 0) {
    savedItemsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No quizzes or assignments found.</td>
      </tr>
    `;
    return;
  }

  savedItems.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${item.subject}</td>
      <td>${item.chapter}</td>
      <td>${item.dueDate}</td>
      <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
      <td>${item.className}</td>
      <td>
        <div class="table-actions">
          <button class="table-btn edit-btn" onclick="editItem(${index})">Edit</button>
          <button class="table-btn delete-btn" onclick="deleteItem(${index})">Delete</button>
          <button class="table-btn preview-btn" onclick="togglePublish(${index})">
            ${item.status === "Published" ? "Unpublish" : "Publish"}
          </button>
          <button class="table-btn preview-btn" onclick="viewSubmissions(${index})">View Submissions</button>
        </div>
      </td>
    `;

    savedItemsTableBody.appendChild(row);
  });
}

function resetQuizForm() {
  document.getElementById("quizForm").reset();
  questionsContainer.innerHTML = "";
  editIndex = -1;
  document.getElementById("quizSubmitBtn").textContent = "Save Quiz";
  addQuestionBlock();
}

function resetAssignmentForm() {
  document.getElementById("assignmentForm").reset();
  editIndex = -1;
  document.getElementById("assignmentSubmitBtn").textContent = "Save Assignment";
}

addQuestionBlock();
renderSavedItems();