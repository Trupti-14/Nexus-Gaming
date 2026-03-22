const studentSearch = document.getElementById("studentSearch");
const studentNameEl = document.getElementById("studentName");
const studentRollEl = document.getElementById("studentRoll");
const studentClassEl = document.getElementById("studentClass");
const guardianNameEl = document.getElementById("guardianName");
const guardianPhoneEl = document.getElementById("guardianPhone");
const guardianEmailEl = document.getElementById("guardianEmail");
const avgMarksEl = document.getElementById("avgMarks");
const quizCompletionEl = document.getElementById("quizCompletion");
const assignmentCompletionEl = document.getElementById("assignmentCompletion");
const attendanceValueEl = document.getElementById("attendanceValue");
const strengthsList = document.getElementById("strengthsList");
const weakAreasList = document.getElementById("weakAreasList");
const reportTableBody = document.getElementById("reportTableBody");
const progressChart = document.getElementById("progressChart");
const teacherRemarks = document.getElementById("teacherRemarks");

const studentsData = [
  {
    name: "Aarav Sharma",
    roll: "LKG-12",
    className: "LKG-A",
    guardianName: "Rajesh Sharma",
    guardianPhone: "+91 9876543210",
    guardianEmail: "rajesh.sharma@gmail.com",
    avgMarks: 88,
    quizCompletion: 90,
    assignmentCompletion: 80,
    attendance: 95,
    strengths: [
      "Excellent alphabet recognition",
      "Good classroom participation",
      "Fast rhyme memorization"
    ],
    weakAreas: [
      "Needs more handwriting practice",
      "Can improve word-picture matching"
    ],
    progress: [60, 68, 74, 79, 84, 88, 90],
    reports: [
      { name: "Alphabet Quiz", type: "Quiz", marks: "18/20", date: "2026-03-03", status: "Completed" },
      { name: "Rhymes Practice", type: "Assignment", marks: "9/10", date: "2026-03-06", status: "Completed" },
      { name: "Vocabulary Test", type: "Quiz", marks: "17/20", date: "2026-03-10", status: "Completed" },
      { name: "Picture Matching HW", type: "Assignment", marks: "-", date: "2026-03-12", status: "Pending" }
    ],
    remarks: "Aarav is progressing well. Focus more on handwriting and vocabulary reinforcement."
  },
  {
    name: "Diya Patel",
    roll: "UKG-08",
    className: "UKG-A",
    guardianName: "Neha Patel",
    guardianPhone: "+91 9988776655",
    guardianEmail: "neha.patel@gmail.com",
    avgMarks: 74,
    quizCompletion: 78,
    assignmentCompletion: 70,
    attendance: 84,
    strengths: [
      "Good understanding of phonics",
      "Answers confidently in class"
    ],
    weakAreas: [
      "Needs more practice in subtraction",
      "Can improve sentence writing"
    ],
    progress: [52, 60, 63, 66, 70, 72, 74],
    reports: [
      { name: "Phonics Quiz", type: "Quiz", marks: "16/20", date: "2026-03-02", status: "Completed" },
      { name: "Sentence Writing", type: "Assignment", marks: "7/10", date: "2026-03-07", status: "Completed" },
      { name: "Math Operations Quiz", type: "Quiz", marks: "14/20", date: "2026-03-11", status: "Completed" },
      { name: "Shapes Worksheet", type: "Assignment", marks: "-", date: "2026-03-13", status: "Pending" }
    ],
    remarks: "Diya shows good interest. More guided practice is needed in subtraction and writing."
  },
  {
    name: "Meera Joshi",
    roll: "1ST-04",
    className: "1st-A",
    guardianName: "Sonal Joshi",
    guardianPhone: "+91 9090909090",
    guardianEmail: "sonal.joshi@gmail.com",
    avgMarks: 94,
    quizCompletion: 96,
    assignmentCompletion: 92,
    attendance: 98,
    strengths: [
      "Excellent reading fluency",
      "Strong in addition and subtraction",
      "Very consistent in submissions"
    ],
    weakAreas: [
      "Needs slightly better paragraph spacing"
    ],
    progress: [70, 76, 82, 86, 89, 92, 94],
    reports: [
      { name: "Reading Skills Quiz", type: "Quiz", marks: "19/20", date: "2026-03-01", status: "Completed" },
      { name: "Paragraph Writing", type: "Assignment", marks: "9/10", date: "2026-03-05", status: "Completed" },
      { name: "Addition Test", type: "Quiz", marks: "20/20", date: "2026-03-09", status: "Completed" },
      { name: "Shapes Activity", type: "Assignment", marks: "9/10", date: "2026-03-12", status: "Completed" }
    ],
    remarks: "Excellent performance overall. Encourage continued reading and neat presentation."
  }
];

let currentStudent = studentsData[0];

function renderStudent(student) {
  currentStudent = student;

  studentNameEl.textContent = student.name;
  studentRollEl.textContent = student.roll;
  studentClassEl.textContent = student.className;
  guardianNameEl.textContent = student.guardianName;
  guardianPhoneEl.textContent = student.guardianPhone;
  guardianEmailEl.textContent = student.guardianEmail;
  avgMarksEl.textContent = `${student.avgMarks}%`;
  quizCompletionEl.textContent = `${student.quizCompletion}%`;
  assignmentCompletionEl.textContent = `${student.assignmentCompletion}%`;
  attendanceValueEl.textContent = `${student.attendance}%`;
  teacherRemarks.value = student.remarks || "";

  renderStrengths(student.strengths);
  renderWeakAreas(student.weakAreas);
  renderTable(student.reports);
  renderProgressChart(student.progress);
}

function renderStrengths(strengths) {
  strengthsList.innerHTML = "";

  strengths.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<h4>Strength</h4><p>${item}</p>`;
    strengthsList.appendChild(div);
  });
}

function renderWeakAreas(weakAreas) {
  weakAreasList.innerHTML = "";

  weakAreas.forEach((item) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<h4>Weak Area</h4><p>${item}</p>`;
    weakAreasList.appendChild(div);
  });
}

function renderTable(reports) {
  reportTableBody.innerHTML = "";

  reports.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${item.marks}</td>
      <td>${item.date}</td>
      <td>
        <span class="status-pill ${item.status === "Completed" ? "completed-pill" : "pending-pill"}">
          ${item.status}
        </span>
      </td>
    `;

    reportTableBody.appendChild(row);
  });
}

function renderProgressChart(progress) {
  const width = 700;
  const height = 240;
  const padding = 30;
  const maxValue = 100;
  const stepX = (width - padding * 2) / (progress.length - 1);

  let points = progress.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((value / maxValue) * (height - padding * 2));
    return `${x},${y}`;
  }).join(" ");

  progressChart.innerHTML = `
    <polyline
      fill="none"
      stroke="#19e3ff"
      stroke-width="4"
      points="${points}"
    />
    ${progress.map((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((value / maxValue) * (height - padding * 2));
      return `<circle cx="${x}" cy="${y}" r="6" fill="#ff2ea6" />`;
    }).join("")}
  `;
}

function searchStudent() {
  const searchValue = studentSearch.value.trim().toLowerCase();

  if (!searchValue) {
    renderStudent(studentsData[0]);
    return;
  }

  const foundStudent = studentsData.find((student) =>
    student.name.toLowerCase().includes(searchValue)
  );

  if (foundStudent) {
    renderStudent(foundStudent);
  } else {
    alert("Student not found.");
  }
}

function saveRemarks() {
  currentStudent.remarks = teacherRemarks.value.trim();
  alert("Teacher remarks saved successfully.");
}

function downloadStudentReport() {
  let reportText = `Individual Student Report

Name: ${currentStudent.name}
Roll No: ${currentStudent.roll}
Class: ${currentStudent.className}

Parent/Guardian:
Name: ${currentStudent.guardianName}
Phone: ${currentStudent.guardianPhone}
Email: ${currentStudent.guardianEmail}

Performance Summary:
Average Marks: ${currentStudent.avgMarks}%
Quiz Completion: ${currentStudent.quizCompletion}%
Assignment Completion: ${currentStudent.assignmentCompletion}%
Attendance: ${currentStudent.attendance}%

Strengths:
${currentStudent.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Weak Areas:
${currentStudent.weakAreas.map((w, i) => `${i + 1}. ${w}`).join("\n")}

Detailed Reports:
${currentStudent.reports.map((r) => `${r.name} | ${r.type} | ${r.marks} | ${r.date} | ${r.status}`).join("\n")}

Teacher Remarks:
${teacherRemarks.value}
`;

  const blob = new Blob([reportText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${currentStudent.name.replace(/\s+/g, "_").toLowerCase()}_report.txt`;
  link.click();
}

renderStudent(studentsData[0]);