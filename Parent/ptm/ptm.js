// PTM JavaScript Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the PTM page
  initializePTM();

  // Form handling
  const meetingRequestForm = document.getElementById("meetingRequestForm");
  if (meetingRequestForm) {
    meetingRequestForm.addEventListener("submit", handleMeetingRequest);
  }

  // Set minimum date for date picker (today + 1 day)
  const dateInput = document.getElementById("preferredDate");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }
});

function initializePTM() {
  // Load upcoming meetings
  loadUpcomingMeetings();

  // Load meeting history
  loadMeetingHistory();

  // Initialize calendar
  initializeCalendar();

  // Check for any URL parameters (e.g., after form submission)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'meeting_requested') {
    showSuccessMessage('Meeting request sent successfully! The teacher will review and respond within 24 hours.');
  }
}

function handleMeetingRequest(e) {
  e.preventDefault();

  const formData = {
    meetingType: document.getElementById("meetingType").value,
    preferredDate: document.getElementById("preferredDate").value,
    preferredTime: document.getElementById("preferredTime").value,
    meetingTopic: document.getElementById("meetingTopic").value,
    contactMethod: document.getElementById("contactMethod").value,
    childName: "Aarav Sharma",
    parentName: "Parent Name",
    submittedAt: new Date().toISOString()
  };

  // Validate form
  if (!validateMeetingRequest(formData)) {
    return;
  }

  // Send request to server
  fetch('/api/ptm/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showSuccessMessage('Meeting request sent successfully! You will receive a confirmation email shortly.');
      document.getElementById("meetingRequestForm").reset();
      // Reload upcoming meetings
      setTimeout(() => {
        loadUpcomingMeetings();
      }, 1000);
    } else {
      showErrorMessage(data.message || 'Failed to send meeting request. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showErrorMessage('Failed to send meeting request. Please check your connection and try again.');
  });
}

function validateMeetingRequest(data) {
  if (!data.meetingType) {
    showErrorMessage('Please select a meeting type.');
    return false;
  }

  if (!data.preferredDate) {
    showErrorMessage('Please select a preferred date.');
    return false;
  }

  if (!data.preferredTime) {
    showErrorMessage('Please select a preferred time.');
    return false;
  }

  if (!data.meetingTopic.trim()) {
    showErrorMessage('Please describe what you would like to discuss.');
    return false;
  }

  if (!data.contactMethod) {
    showErrorMessage('Please select a preferred contact method.');
    return false;
  }

  // Check if selected date/time is in the past
  const selectedDateTime = new Date(`${data.preferredDate}T${data.preferredTime}`);
  const now = new Date();

  if (selectedDateTime <= now) {
    showErrorMessage('Please select a future date and time.');
    return false;
  }

  return true;
}

function loadUpcomingMeetings() {
  // Simulate API call - in real app, this would fetch from server
  const upcomingMeetings = [
    {
      id: 'meeting1',
      type: 'Academic Progress Review',
      date: '2026-03-20',
      time: '14:00',
      teacher: 'Mrs. Vedika',
      status: 'pending',
      topic: 'Discuss reading and math progress'
    },
    {
      id: 'meeting2',
      type: 'Parent-Teacher Conference',
      date: '2026-03-25',
      time: '10:00',
      teacher: 'Mrs. Vedika',
      status: 'approved',
      topic: 'General progress discussion'
    }
  ];

  renderUpcomingMeetings(upcomingMeetings);
}

function renderUpcomingMeetings(meetings) {
  const container = document.getElementById('upcomingMeetings');
  if (!container) return;

  container.innerHTML = '';

  if (meetings.length === 0) {
    container.innerHTML = '<p class="no-meetings">No upcoming meetings scheduled.</p>';
    return;
  }

  meetings.forEach(meeting => {
    const meetingElement = createMeetingElement(meeting, 'upcoming');
    container.appendChild(meetingElement);
  });
}

function loadMeetingHistory() {
  // Simulate API call - in real app, this would fetch from server
  const meetingHistory = [
    {
      id: 'meeting3',
      type: 'Monthly Progress Review',
      date: '2026-02-15',
      duration: '30 minutes',
      teacher: 'Mrs. Vedika',
      outcome: 'Discussed reading improvement strategies',
      notes: 'Aarav has shown significant improvement in phonics recognition. Recommended additional reading practice at home. Teacher will provide reading materials next week.'
    },
    {
      id: 'meeting4',
      type: 'Behavior Discussion',
      date: '2026-01-28',
      duration: '25 minutes',
      teacher: 'Mrs. Vedika',
      outcome: 'Positive behavior reinforcement plan',
      notes: 'Discussed classroom behavior expectations. Aarav responds well to positive reinforcement. Agreed on a reward system for good behavior and focus during class activities.'
    }
  ];

  renderMeetingHistory(meetingHistory);
}

function renderMeetingHistory(meetings) {
  const container = document.getElementById('meetingHistory');
  if (!container) return;

  container.innerHTML = '';

  if (meetings.length === 0) {
    container.innerHTML = '<p class="no-meetings">No meeting history available.</p>';
    return;
  }

  meetings.forEach(meeting => {
    const meetingElement = createMeetingElement(meeting, 'completed');
    container.appendChild(meetingElement);
  });
}

function createMeetingElement(meeting, type) {
  const meetingDiv = document.createElement('div');
  meetingDiv.className = `meeting-item ${type}`;

  let actions = '';
  let statusText = '';

  if (type === 'upcoming') {
    if (meeting.status === 'pending') {
      statusText = '<span class="status pending">Pending Approval</span>';
      actions = `
        <button class="action-btn small-btn" onclick="editMeeting('${meeting.id}')">Edit</button>
        <button class="action-btn small-btn danger" onclick="cancelMeeting('${meeting.id}')">Cancel</button>
      `;
    } else if (meeting.status === 'approved') {
      statusText = '<span class="status approved">Approved</span>';
      actions = `
        <button class="action-btn small-btn" onclick="joinMeeting('${meeting.id}')">Join Meeting</button>
      `;
    }
  } else if (type === 'completed') {
    actions = `
      <button class="action-btn small-btn" onclick="viewNotes('${meeting.id}')">View Notes</button>
    `;
  }

  meetingDiv.innerHTML = `
    <div class="meeting-icon">${type === 'upcoming' ? '📅' : '✅'}</div>
    <div class="meeting-details">
      <h4>${meeting.type}</h4>
      <p><strong>Date:</strong> ${formatDate(meeting.date)}</p>
      <p><strong>Time:</strong> ${meeting.time ? formatTime(meeting.time) : meeting.duration}</p>
      <p><strong>Teacher:</strong> ${meeting.teacher}</p>
      ${meeting.outcome ? `<p><strong>Outcome:</strong> ${meeting.outcome}</p>` : ''}
      ${statusText ? `<p><strong>Status:</strong> ${statusText}</p>` : ''}
    </div>
    <div class="meeting-actions">
      ${actions}
    </div>
  `;

  return meetingDiv;
}

function initializeCalendar() {
  // Calendar is already rendered in HTML, but we can add dynamic functionality here
  updateCalendarWeek(new Date());
}

function updateCalendarWeek(startDate) {
  const weekHeader = document.getElementById('currentWeek');
  if (!weekHeader) return;

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const year = startDate.getFullYear();

  if (startMonth === endMonth) {
    weekHeader.textContent = `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    weekHeader.textContent = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

function selectTimeSlot(date, time) {
  // Remove previous selection
  document.querySelectorAll('.time-slot.selected').forEach(slot => {
    slot.classList.remove('selected');
  });

  // Find and select the clicked slot
  const slots = document.querySelectorAll('.time-slot');
  slots.forEach(slot => {
    if (slot.textContent.trim() === formatTime(time) && slot.onclick) {
      const slotDate = slot.onclick.toString().match(/'([^']+)'/)[1];
      if (slotDate === date) {
        slot.classList.add('selected');

        // Auto-fill the form
        document.getElementById('preferredDate').value = date;
        document.getElementById('preferredTime').value = time;
      }
    }
  });
}

function editMeeting(meetingId) {
  // In a real app, this would open an edit modal or redirect to edit page
  alert(`Edit meeting: ${meetingId}\nThis feature would allow you to modify the meeting request.`);
}

function cancelMeeting(meetingId) {
  if (confirm('Are you sure you want to cancel this meeting request?')) {
    // Send cancellation request to server
    fetch(`/api/ptm/cancel/${meetingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showSuccessMessage('Meeting request cancelled successfully.');
        loadUpcomingMeetings(); // Reload the list
      } else {
        showErrorMessage('Failed to cancel meeting request.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showErrorMessage('Failed to cancel meeting request.');
    });
  }
}

function joinMeeting(meetingId) {
  // In a real app, this would redirect to video call or provide meeting link
  alert(`Join meeting: ${meetingId}\nThis would open the video call or provide meeting details.`);
}

function viewNotes(meetingId) {
  // Mock meeting notes data
  const meetingNotes = {
    'meeting3': {
      title: 'Monthly Progress Review - February 15, 2026',
      teacher: 'Mrs. Vedika',
      duration: '30 minutes',
      attendees: 'Parent (Rajesh Sharma), Teacher (Mrs. Vedika)',
      discussion: 'Discussed Aarav\'s academic progress in reading and mathematics. Reviewed recent quiz scores and homework completion.',
      keyPoints: [
        'Aarav has improved significantly in phonics recognition',
        'Math skills are developing well, especially number recognition',
        'Needs more practice with basic addition and subtraction',
        'Reading comprehension is progressing steadily'
      ],
      actionItems: [
        'Parent to practice reading with Aarav 15 minutes daily',
        'Teacher will provide additional math worksheets',
        'Schedule follow-up meeting in one month',
        'Parent to monitor homework completion'
      ],
      nextSteps: 'Continue with current learning plan. Monitor progress and adjust as needed.'
    },
    'meeting4': {
      title: 'Behavior Discussion - January 28, 2026',
      teacher: 'Mrs. Vedika',
      duration: '25 minutes',
      attendees: 'Parent (Rajesh Sharma), Teacher (Mrs. Vedika)',
      discussion: 'Discussed classroom behavior and social interactions. Reviewed positive behavior reinforcement strategies.',
      keyPoints: [
        'Aarav is generally well-behaved in class',
        'Occasionally distracted during group activities',
        'Responds well to positive reinforcement',
        'Good peer interactions with classmates'
      ],
      actionItems: [
        'Implement star chart system at home for good behavior',
        'Teacher will use more positive reinforcement in class',
        'Parent to discuss classroom expectations with Aarav',
        'Monitor progress over next two weeks'
      ],
      nextSteps: 'Continue positive reinforcement approach. Follow up if behavior issues persist.'
    }
  };

  const notes = meetingNotes[meetingId];
  if (notes) {
    showMeetingNotesModal(notes);
  } else {
    showErrorMessage('Meeting notes not found.');
  }
}

function showMeetingNotesModal(notes) {
  const modal = document.getElementById('meetingNotesModal');
  const content = document.getElementById('meetingNotesContent');

  content.innerHTML = `
    <div class="meeting-notes">
      <h4>${notes.title}</h4>
      <div class="notes-section">
        <h5>Meeting Details</h5>
        <p><strong>Teacher:</strong> ${notes.teacher}</p>
        <p><strong>Duration:</strong> ${notes.duration}</p>
        <p><strong>Attendees:</strong> ${notes.attendees}</p>
      </div>

      <div class="notes-section">
        <h5>Discussion Summary</h5>
        <p>${notes.discussion}</p>
      </div>

      <div class="notes-section">
        <h5>Key Points</h5>
        <ul>
          ${notes.keyPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>

      <div class="notes-section">
        <h5>Action Items</h5>
        <ul>
          ${notes.actionItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="notes-section">
        <h5>Next Steps</h5>
        <p>${notes.nextSteps}</p>
      </div>
    </div>
  `;

  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('meetingNotesModal');
  modal.style.display = 'none';
}

function scheduleUrgentMeeting() {
  // Pre-fill form with urgent meeting type
  document.getElementById('meetingType').value = 'emergency';
  document.getElementById('meetingTopic').value = 'Urgent concern regarding child\'s progress/behavior. Please contact me as soon as possible.';

  // Scroll to form
  document.getElementById('meetingRequestForm').scrollIntoView({ behavior: 'smooth' });

  showSuccessMessage('Urgent meeting form pre-filled. Please complete the details and submit.');
}

function viewTeacherContact() {
  alert('Teacher Contact Information:\n\nMrs. Vedika\nEmail: vedika.teacher@nexusarena.edu\nPhone: +91 98765 43210\n\nAvailable: Monday-Friday, 8:00 AM - 4:00 PM');
}

function downloadMeetingReport() {
  // In a real app, this would generate and download a PDF report
  alert('Downloading meeting report...\n\nThis feature would generate a comprehensive PDF report of all PTM meetings, including dates, topics discussed, action items, and progress tracking.');
}

function viewMeetingGuidelines() {
  const guidelines = `
PTM MEETING GUIDELINES

1. Preparation:
   - Review your child's recent progress reports
   - Prepare specific questions or concerns
   - Bring any relevant documents or work samples

2. During the Meeting:
   - Be specific about your concerns or questions
   - Listen actively to the teacher's feedback
   - Discuss both strengths and areas for improvement
   - Ask about strategies to support learning at home

3. Action Items:
   - Note down agreed-upon action items
   - Follow through on commitments
   - Maintain regular communication with the teacher

4. Scheduling:
   - Request meetings at least 3-5 days in advance
   - Be flexible with timing when possible
   - Urgent concerns can be addressed immediately

5. Best Practices:
   - Focus on solutions rather than problems
   - Maintain a positive and collaborative tone
   - Follow up on action items in subsequent meetings
  `;

  alert(guidelines);
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function showSuccessMessage(message) {
  // Create and show success message
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message success';
  messageDiv.innerHTML = `
    <div class="message-content">
      <span class="message-icon">✅</span>
      <span>${message}</span>
    </div>
  `;

  showMessage(messageDiv);
}

function showErrorMessage(message) {
  // Create and show error message
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message error';
  messageDiv.innerHTML = `
    <div class="message-content">
      <span class="message-icon">❌</span>
      <span>${message}</span>
    </div>
  `;

  showMessage(messageDiv);
}

function showMessage(messageDiv) {
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1001;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
  `;

  // Style based on type
  if (messageDiv.classList.contains('success')) {
    messageDiv.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
  } else {
    messageDiv.style.background = 'linear-gradient(45deg, #dc3545, #fd7e14)';
  }

  document.body.appendChild(messageDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 300);
  }, 5000);
}

// Add message animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .message-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .message-icon {
    font-size: 18px;
  }

  .no-meetings {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 20px;
  }

  .meeting-notes h4 {
    color: var(--cyan);
    margin-bottom: 20px;
    font-size: 20px;
  }

  .notes-section {
    margin-bottom: 20px;
  }

  .notes-section h5 {
    color: var(--text);
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
  }

  .notes-section p {
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .notes-section ul {
    color: var(--text-muted);
    padding-left: 20px;
  }

  .notes-section li {
    margin-bottom: 5px;
    line-height: 1.4;
  }
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('meetingNotesModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}