// Teacher PTM JavaScript Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the PTM page
  initializeTeacherPTM();

  // Load data
  loadMeetingRequests();
  loadTodaySchedule();
  loadWeeklyCalendar();
  loadMeetingHistory();

  // Set up search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
});

function initializeTeacherPTM() {
  // Set current date
  const today = new Date();
  document.getElementById('currentDate').textContent = formatDate(today);

  // Set current week
  updateWeekDisplay(new Date());

  // Update stats
  updateStats();
}

function loadMeetingRequests() {
  fetch('/api/ptm/upcoming')
    .then(response => response.json())
    .then(data => {
      renderMeetingRequests(data);
      updateStats();
    })
    .catch(error => {
      console.error('Error loading meeting requests:', error);
      showErrorMessage('Failed to load meeting requests');
    });
}

function renderMeetingRequests(requests) {
  const container = document.getElementById('requestsList');
  if (!container) return;

  if (requests.length === 0) {
    container.innerHTML = '<p class="no-requests">No meeting requests at this time.</p>';
    return;
  }

  container.innerHTML = '';

  requests.forEach(request => {
    const requestElement = createRequestElement(request);
    container.appendChild(requestElement);
  });
}

function createRequestElement(request) {
  const requestDiv = document.createElement('div');
  requestDiv.className = 'request-item';

  const meetingType = getMeetingTypeDisplay(request.meetingType);
  const isUrgent = request.meetingType === 'emergency';
  const statusClass = isUrgent ? 'urgent' : 'pending';

  requestDiv.innerHTML = `
    <div class="request-icon">${isUrgent ? '🚨' : '📋'}</div>
    <div class="request-details">
      <h4>${meetingType}</h4>
      <p><strong>Parent:</strong> ${request.parentName}</p>
      <p><strong>Child:</strong> ${request.childName}</p>
      <p><strong>Requested:</strong> ${formatDateTime(request.preferredDate, request.preferredTime)}</p>
      <p><strong>Topic:</strong> ${request.meetingTopic.substring(0, 100)}${request.meetingTopic.length > 100 ? '...' : ''}</p>
      <div class="request-meta">
        <span>📞 ${request.contactMethod}</span>
        <span>📅 ${formatDate(request.createdAt)}</span>
        <span class="status-badge ${statusClass}">${isUrgent ? 'URGENT' : 'PENDING'}</span>
      </div>
    </div>
    <div class="request-actions">
      <button class="btn primary-btn" onclick="viewMeetingDetails('${request.id}')">View Details</button>
      <button class="btn secondary-btn" onclick="approveMeeting('${request.id}')">Approve</button>
      <button class="btn danger-btn" onclick="declineMeeting('${request.id}')">Decline</button>
    </div>
  `;

  return requestDiv;
}

function loadTodaySchedule() {
  // Get today's approved meetings
  fetch('/api/ptm/upcoming')
    .then(response => response.json())
    .then(data => {
      const today = new Date().toISOString().split('T')[0];
      const todayMeetings = data.filter(meeting =>
        meeting.status === 'approved' && meeting.preferredDate === today
      );
      renderTodaySchedule(todayMeetings);
    })
    .catch(error => {
      console.error('Error loading today\'s schedule:', error);
    });
}

function renderTodaySchedule(meetings) {
  const container = document.getElementById('todaySchedule');
  if (!container) return;

  if (meetings.length === 0) {
    container.innerHTML = '<p class="no-schedule">No meetings scheduled for today.</p>';
    return;
  }

  // Sort by time
  meetings.sort((a, b) => a.preferredTime.localeCompare(b.preferredTime));

  container.innerHTML = '';

  meetings.forEach(meeting => {
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';

    scheduleItem.innerHTML = `
      <div class="schedule-time">${formatTime(meeting.preferredTime)}</div>
      <div class="schedule-content">
        <h4>${getMeetingTypeDisplay(meeting.meetingType)}</h4>
        <p><strong>Parent:</strong> ${meeting.parentName}</p>
        <p><strong>Child:</strong> ${meeting.childName}</p>
        <p><strong>Contact:</strong> ${meeting.contactMethod}</p>
        <div style="margin-top: 10px;">
          <button class="btn primary-btn" onclick="startMeeting('${meeting.id}')">Start Meeting</button>
          <button class="btn secondary-btn" onclick="viewMeetingDetails('${meeting.id}')">View Details</button>
        </div>
      </div>
    `;

    container.appendChild(scheduleItem);
  });
}

function loadWeeklyCalendar() {
  // Get all upcoming meetings for the current week
  fetch('/api/ptm/upcoming')
    .then(response => response.json())
    .then(data => {
      renderWeeklyCalendar(data);
    })
    .catch(error => {
      console.error('Error loading weekly calendar:', error);
    });
}

function renderWeeklyCalendar(meetings) {
  const container = document.getElementById('weeklyCalendar');
  if (!container) return;

  const weekStart = getWeekStart(new Date());
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDays.push(day);
  }

  container.innerHTML = '';

  weekDays.forEach(day => {
    const dayColumn = document.createElement('div');
    dayColumn.className = 'day-column';

    const dayMeetings = meetings.filter(meeting =>
      meeting.preferredDate === day.toISOString().split('T')[0]
    );

    dayColumn.innerHTML = `
      <div class="day-header">${day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      <div class="day-events">
        ${dayMeetings.map(meeting => `
          <div class="day-event ${meeting.meetingType === 'emergency' ? 'urgent' : ''}"
               onclick="viewMeetingDetails('${meeting.id}')">
            <div><strong>${formatTime(meeting.preferredTime)}</strong></div>
            <div>${meeting.parentName}</div>
            <div style="font-size: 11px;">${getMeetingTypeDisplay(meeting.meetingType)}</div>
          </div>
        `).join('')}
      </div>
    `;

    container.appendChild(dayColumn);
  });
}

function loadMeetingHistory() {
  fetch('/api/ptm/history')
    .then(response => response.json())
    .then(data => {
      renderMeetingHistory(data);
    })
    .catch(error => {
      console.error('Error loading meeting history:', error);
    });
}

function renderMeetingHistory(history) {
  const container = document.getElementById('meetingHistory');
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = '<p class="no-history">No meeting history available.</p>';
    return;
  }

  // Sort by date (most recent first)
  history.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

  container.innerHTML = '';

  history.slice(0, 10).forEach(meeting => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';

    const status = meeting.status;
    const icon = status === 'completed' ? '✅' : status === 'cancelled' ? '❌' : '⏰';
    const date = meeting.completedAt || meeting.createdAt;

    historyItem.innerHTML = `
      <div class="history-icon">${icon}</div>
      <div class="history-details">
        <h4>${getMeetingTypeDisplay(meeting.meetingType)}</h4>
        <p><strong>Parent:</strong> ${meeting.parentName} | <strong>Child:</strong> ${meeting.childName}</p>
        <p><strong>Date:</strong> ${formatDate(date)} | <strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>
      <div class="history-actions">
        <button class="btn secondary-btn" onclick="viewMeetingNotes('${meeting.id}')">View Notes</button>
      </div>
    `;

    container.appendChild(historyItem);
  });
}

function viewMeetingDetails(meetingId) {
  // Find meeting in current data or fetch from API
  fetch('/api/ptm/upcoming')
    .then(response => response.json())
    .then(data => {
      const meeting = data.find(m => m.id === meetingId);
      if (meeting) {
        showMeetingDetailsModal(meeting);
      } else {
        // Check history
        fetch('/api/ptm/history')
          .then(response => response.json())
          .then(historyData => {
            const historyMeeting = historyData.find(m => m.id === meetingId);
            if (historyMeeting) {
              showMeetingDetailsModal(historyMeeting);
            } else {
              showErrorMessage('Meeting not found');
            }
          });
      }
    });
}

function showMeetingDetailsModal(meeting) {
  const modal = document.getElementById('meetingModal');
  const title = document.getElementById('modalTitle');
  const details = document.getElementById('meetingDetails');
  const actions = document.getElementById('modalActions');

  title.textContent = `${getMeetingTypeDisplay(meeting.meetingType)} - Details`;

  details.innerHTML = `
    <div class="meeting-details-grid">
      <div class="detail-section">
        <h4>Meeting Information</h4>
        <p><strong>Type:</strong> ${getMeetingTypeDisplay(meeting.meetingType)}</p>
        <p><strong>Status:</strong> <span class="status-badge ${meeting.status}">${meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}</span></p>
        <p><strong>Requested Date/Time:</strong> ${formatDateTime(meeting.preferredDate, meeting.preferredTime)}</p>
        <p><strong>Contact Method:</strong> ${meeting.contactMethod}</p>
        ${meeting.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meeting.meetingLink}" target="_blank">${meeting.meetingLink}</a></p>` : ''}
      </div>

      <div class="detail-section">
        <h4>Parent & Child Information</h4>
        <p><strong>Parent:</strong> ${meeting.parentName}</p>
        <p><strong>Child:</strong> ${meeting.childName}</p>
        <p><strong>Submitted:</strong> ${formatDateTime(meeting.createdAt)}</p>
        ${meeting.teacherResponse ? `<p><strong>Teacher Response:</strong> ${meeting.teacherResponse}</p>` : ''}
      </div>

      <div class="detail-section full-width">
        <h4>Meeting Topic</h4>
        <p>${meeting.meetingTopic}</p>
      </div>

      ${meeting.discussion ? `
        <div class="detail-section full-width">
          <h4>Discussion Summary</h4>
          <p>${meeting.discussion}</p>
        </div>
      ` : ''}

      ${meeting.keyPoints && meeting.keyPoints.length > 0 ? `
        <div class="detail-section">
          <h4>Key Points</h4>
          <ul>
            ${meeting.keyPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${meeting.actionItems && meeting.actionItems.length > 0 ? `
        <div class="detail-section">
          <h4>Action Items</h4>
          <ul>
            ${meeting.actionItems.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  // Set up action buttons based on meeting status
  actions.innerHTML = '';

  if (meeting.status === 'pending') {
    actions.innerHTML = `
      <button class="btn secondary-btn" onclick="closeModal()">Close</button>
      <button class="btn danger-btn" onclick="declineMeeting('${meeting.id}')">Decline</button>
      <button class="btn primary-btn" onclick="approveMeeting('${meeting.id}')">Approve Meeting</button>
    `;
  } else if (meeting.status === 'approved') {
    actions.innerHTML = `
      <button class="btn secondary-btn" onclick="closeModal()">Close</button>
      <button class="btn primary-btn" onclick="startMeeting('${meeting.id}')">Start Meeting</button>
      <button class="btn secondary-btn" onclick="addMeetingNotes('${meeting.id}')">Add Notes</button>
    `;
  } else {
    actions.innerHTML = `
      <button class="btn secondary-btn" onclick="closeModal()">Close</button>
      ${meeting.status === 'completed' ? `<button class="btn secondary-btn" onclick="viewMeetingNotes('${meeting.id}')">View Full Notes</button>` : ''}
    `;
  }

  modal.style.display = 'block';
}

function approveMeeting(meetingId) {
  const meetingLink = prompt('Enter meeting link (Google Meet, Zoom, etc.) - optional:');
  const response = prompt('Add a response message for the parent (optional):', 'Meeting approved. Please join using the provided link.');

  if (meetingLink === null && response === null) return; // User cancelled

  fetch(`/api/ptm/approve/${meetingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      meetingLink: meetingLink || null,
      response: response || 'Meeting approved'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showSuccessMessage('Meeting approved successfully');
      closeModal();
      loadMeetingRequests();
      loadTodaySchedule();
      loadWeeklyCalendar();
      updateStats();
    } else {
      showErrorMessage(data.message || 'Failed to approve meeting');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showErrorMessage('Failed to approve meeting');
  });
}

function declineMeeting(meetingId) {
  const reason = prompt('Reason for declining (optional):');

  if (reason === null) return; // User cancelled

  // For now, just remove from upcoming meetings
  // In a real app, you might want to send a decline notification
  if (confirm('Are you sure you want to decline this meeting request?')) {
    showSuccessMessage('Meeting declined. The parent will be notified.');
    closeModal();
    loadMeetingRequests();
    updateStats();
  }
}

function startMeeting(meetingId) {
  // In a real app, this would open the meeting link or start a video call
  alert(`Starting meeting: ${meetingId}\n\nThis would open the video call or meeting link.`);
}

function addMeetingNotes(meetingId) {
  // Open notes modal
  const notesModal = document.getElementById('notesModal');
  notesModal.style.display = 'block';

  // Store meeting ID for saving notes
  notesModal.dataset.meetingId = meetingId;
}

function saveMeetingNotes() {
  const meetingId = document.getElementById('notesModal').dataset.meetingId;
  const notesData = {
    duration: parseInt(document.getElementById('meetingDuration').value) || 30,
    discussion: document.getElementById('discussionSummary').value,
    keyPoints: document.getElementById('keyPoints').value.split('\n').filter(point => point.trim()),
    actionItems: document.getElementById('actionItems').value.split('\n').filter(item => item.trim()),
    nextSteps: document.getElementById('nextSteps').value,
    followUpDate: document.getElementById('followUpDate').value || null
  };

  // In a real app, this would save to the database
  // For now, just show success and close modal
  showSuccessMessage('Meeting notes saved successfully');
  closeNotesModal();
  closeModal();

  // Reload data
  loadMeetingRequests();
  loadMeetingHistory();
}

function viewMeetingNotes(meetingId) {
  fetch(`/api/ptm/notes/${meetingId}`)
    .then(response => response.json())
    .then(data => {
      showMeetingDetailsModal(data);
    })
    .catch(error => {
      console.error('Error loading meeting notes:', error);
      showErrorMessage('Failed to load meeting notes');
    });
}

function filterRequests(filterType) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => btn.classList.remove('active'));

  event.target.classList.add('active');

  // Reload requests with filter
  loadMeetingRequests();
}

function filterHistory() {
  const filter = document.getElementById('historyFilter').value;
  loadMeetingHistory();
}

function handleSearch() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  // Filter visible items based on search term
  const requestItems = document.querySelectorAll('.request-item');
  requestItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

function updateWeekDisplay(weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'long' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekStart.getFullYear();

  let weekText;
  if (startMonth === endMonth) {
    weekText = `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    weekText = `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }

  document.getElementById('currentWeek').textContent = weekText;
}

function previousWeek() {
  const currentWeek = getWeekStart(new Date());
  currentWeek.setDate(currentWeek.getDate() - 7);
  updateWeekDisplay(currentWeek);
  loadWeeklyCalendar();
}

function nextWeek() {
  const currentWeek = getWeekStart(new Date());
  currentWeek.setDate(currentWeek.getDate() + 7);
  updateWeekDisplay(currentWeek);
  loadWeeklyCalendar();
}

function updateStats() {
  // Mock stats update - in real app, calculate from actual data
  document.getElementById('pendingRequests').textContent = '2';
  document.getElementById('approvedMeetings').textContent = '1';
  document.getElementById('completedToday').textContent = '0';
  document.getElementById('upcomingToday').textContent = '1';
}

function closeModal() {
  document.getElementById('meetingModal').style.display = 'none';
}

function closeNotesModal() {
  document.getElementById('notesModal').style.display = 'none';
  // Reset form
  document.getElementById('notesForm').reset();
}

// Utility functions
function getMeetingTypeDisplay(type) {
  const types = {
    'progress': 'Academic Progress Discussion',
    'behavior': 'Behavior & Discipline',
    'special': 'Special Needs Assessment',
    'general': 'General Discussion',
    'emergency': 'Urgent Concern'
  };
  return types[type] || type;
}

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

function formatDateTime(dateString, timeString) {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
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

  .no-requests, .no-schedule, .no-history {
    text-align: center;
    color: var(--muted);
    font-style: italic;
    padding: 20px;
  }

  .meeting-details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .detail-section {
    background: var(--bg-card);
    padding: 15px;
    border-radius: 8px;
    border: 1px solid var(--border);
  }

  .detail-section.full-width {
    grid-column: 1 / -1;
  }

  .detail-section h4 {
    color: var(--cyan);
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
  }

  .detail-section p {
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .detail-section ul {
    padding-left: 20px;
  }

  .detail-section li {
    margin-bottom: 5px;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .meeting-details-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.onclick = function(event) {
  const meetingModal = document.getElementById('meetingModal');
  const notesModal = document.getElementById('notesModal');

  if (event.target === meetingModal) {
    meetingModal.style.display = 'none';
  }
  if (event.target === notesModal) {
    closeNotesModal();
  }
}