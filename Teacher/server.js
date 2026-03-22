const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle API routes
  if (pathname.startsWith('/api/feedback')) {
    if (req.method === 'POST') {
      handleFeedbackSubmission(req, res);
      return;
    } else if (req.method === 'GET') {
      handleFeedbackRetrieval(res);
      return;
    } else if (req.method === 'PUT') {
      const id = pathname.split('/').pop();
      handleFeedbackUpdate(req, res, id);
      return;
    } else if (req.method === 'DELETE') {
      const id = pathname.split('/').pop();
      handleFeedbackDelete(res, id);
      return;
    }
  }

  // Handle PTM routes
  if (pathname.startsWith('/api/ptm/')) {
    if (pathname === '/api/ptm/request' && req.method === 'POST') {
      handlePTMRequest(req, res);
      return;
    } else if (pathname === '/api/ptm/upcoming' && req.method === 'GET') {
      handlePTMUpcoming(res);
      return;
    } else if (pathname === '/api/ptm/history' && req.method === 'GET') {
      handlePTMHistory(res);
      return;
    } else if (pathname.startsWith('/api/ptm/cancel/') && req.method === 'POST') {
      const id = pathname.split('/').pop();
      handlePTMCancel(req, res, id);
      return;
    } else if (pathname.startsWith('/api/ptm/approve/') && req.method === 'POST') {
      const id = pathname.split('/').pop();
      handlePTMApprove(req, res, id);
      return;
    } else if (pathname.startsWith('/api/ptm/notes/') && req.method === 'GET') {
      const id = pathname.split('/').pop();
      handlePTMNotes(res, id);
      return;
    }
  }

  // Determine base directory
  let baseDir;
  if (pathname.startsWith('/parent/')) {
    baseDir = path.join(__dirname, '..', 'Parent');
    pathname = pathname.replace('/parent', '');
  } else {
    baseDir = __dirname; // Teacher
    if (!pathname.startsWith('/teacher/')) {
      // Default to teacher if not specified
      pathname = '/teacher' + pathname;
    }
    pathname = pathname.replace('/teacher', '');
  }

  // Default to dashboard if root is requested
  if (pathname === '/' || pathname === '') {
    pathname = '/dashboard/dashboard.html';
  }

  // Remove leading slash and decode URI
  const filePath = path.join(baseDir, decodeURIComponent(pathname));

  // Security check - prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const rootPath = path.resolve(baseDir);

  if (!resolvedPath.startsWith(rootPath)) {
    res.writeHead(403);
    res.end('Access denied');
    return;
  }

  // Get file extension for content type
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  const contentType = contentTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 - File Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>404 - File Not Found</h1>
            <p>The requested file <strong>${pathname}</strong> was not found.</p>
            <p><a href="/teacher/dashboard/dashboard.html">Go to Teacher Dashboard</a></p>
            <p><a href="/parent/dashboard/dashboard.html">Go to Parent Dashboard</a></p>
          </body>
          </html>
        `);
      } else {
        res.writeHead(500);
        res.end('Internal Server Error');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

function handleFeedbackSubmission(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const feedback = JSON.parse(body);
      const feedbackFile = path.join(__dirname, 'feedback.json');

      // Read existing feedback
      fs.readFile(feedbackFile, (err, data) => {
        let feedbacks = [];
        if (!err) {
          feedbacks = JSON.parse(data);
        }

        // Add new feedback
        const newFeedback = {
          id: Date.now(),
          message: feedback.message,
          timestamp: new Date().toISOString(),
          read: false
        };
        feedbacks.push(newFeedback);

        // Write back
        fs.writeFile(feedbackFile, JSON.stringify(feedbacks, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to save feedback' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      });
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

function handleFeedbackRetrieval(res) {
  const feedbackFile = path.join(__dirname, 'feedback.json');
  fs.readFile(feedbackFile, (err, data) => {
    let feedbacks = [];
    if (!err) {
      feedbacks = JSON.parse(data);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(feedbacks));
  });
}

function handleFeedbackUpdate(req, res, id) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const update = JSON.parse(body);
      const feedbackFile = path.join(__dirname, 'feedback.json');

      fs.readFile(feedbackFile, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Feedback not found' }));
          return;
        }

        let feedbacks = JSON.parse(data);
        const feedbackIndex = feedbacks.findIndex(f => f.id == id);
        if (feedbackIndex === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Feedback not found' }));
          return;
        }

        feedbacks[feedbackIndex] = { ...feedbacks[feedbackIndex], ...update };

        fs.writeFile(feedbackFile, JSON.stringify(feedbacks, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to update feedback' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      });
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

function handleFeedbackDelete(res, id) {
  const feedbackFile = path.join(__dirname, 'feedback.json');
  fs.readFile(feedbackFile, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Feedback not found' }));
      return;
    }

    let feedbacks = JSON.parse(data);
    const filteredFeedbacks = feedbacks.filter(f => f.id != id);

    if (filteredFeedbacks.length === feedbacks.length) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Feedback not found' }));
      return;
    }

    fs.writeFile(feedbackFile, JSON.stringify(filteredFeedbacks, null, 2), (err) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to delete feedback' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
  });
}

// PTM Handler Functions
function handlePTMRequest(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const meetingRequest = JSON.parse(body);
      const ptmFile = path.join(__dirname, 'ptm.json');

      // Read existing PTM data
      fs.readFile(ptmFile, (err, data) => {
        let ptmData = { meetings: [], history: [] };
        if (!err) {
          ptmData = JSON.parse(data);
        }

        // Add new meeting request
        const newMeeting = {
          id: Date.now().toString(),
          ...meetingRequest,
          status: 'pending',
          teacherResponse: null,
          meetingLink: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        ptmData.meetings.push(newMeeting);

        // Write back
        fs.writeFile(ptmFile, JSON.stringify(ptmData, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to save meeting request' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: 'Meeting request submitted successfully',
            meetingId: newMeeting.id
          }));
        });
      });
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON data' }));
    }
  });
}

function handlePTMUpcoming(res) {
  const ptmFile = path.join(__dirname, 'ptm.json');
  fs.readFile(ptmFile, (err, data) => {
    let ptmData = { meetings: [], history: [] };
    if (!err) {
      ptmData = JSON.parse(data);
    }

    // Filter upcoming meetings (pending or approved)
    const upcomingMeetings = ptmData.meetings.filter(meeting =>
      meeting.status === 'pending' || meeting.status === 'approved'
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(upcomingMeetings));
  });
}

function handlePTMHistory(res) {
  const ptmFile = path.join(__dirname, 'ptm.json');
  fs.readFile(ptmFile, (err, data) => {
    let ptmData = { meetings: [], history: [] };
    if (!err) {
      ptmData = JSON.parse(data);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ptmData.history));
  });
}

function handlePTMCancel(req, res, id) {
  const ptmFile = path.join(__dirname, 'ptm.json');
  fs.readFile(ptmFile, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'PTM data not found' }));
      return;
    }

    let ptmData = JSON.parse(data);
    const meetingIndex = ptmData.meetings.findIndex(m => m.id === id);

    if (meetingIndex === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Meeting not found' }));
      return;
    }

    // Move to history with cancelled status
    const cancelledMeeting = {
      ...ptmData.meetings[meetingIndex],
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'parent'
    };

    ptmData.history.push(cancelledMeeting);
    ptmData.meetings.splice(meetingIndex, 1);

    fs.writeFile(ptmFile, JSON.stringify(ptmData, null, 2), (err) => {
      if (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Failed to cancel meeting' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Meeting cancelled successfully' }));
    });
  });
}

function handlePTMApprove(req, res, id) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const approvalData = JSON.parse(body);
      const ptmFile = path.join(__dirname, 'ptm.json');

      fs.readFile(ptmFile, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'PTM data not found' }));
          return;
        }

        let ptmData = JSON.parse(data);
        const meetingIndex = ptmData.meetings.findIndex(m => m.id === id);

        if (meetingIndex === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Meeting not found' }));
          return;
        }

        // Update meeting with approval
        ptmData.meetings[meetingIndex] = {
          ...ptmData.meetings[meetingIndex],
          status: 'approved',
          teacherResponse: approvalData.response || 'Meeting approved',
          meetingLink: approvalData.meetingLink || null,
          approvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        fs.writeFile(ptmFile, JSON.stringify(ptmData, null, 2), (err) => {
          if (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to approve meeting' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Meeting approved successfully' }));
        });
      });
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON data' }));
    }
  });
}

function handlePTMNotes(res, id) {
  const ptmFile = path.join(__dirname, 'ptm.json');
  fs.readFile(ptmFile, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'PTM data not found' }));
      return;
    }

    let ptmData = JSON.parse(data);
    const meeting = ptmData.history.find(m => m.id === id);

    if (!meeting) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Meeting notes not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(meeting));
  });
}

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Multi-Dashboard Server running at:`);
  console.log(`📱 http://localhost:${PORT}`);
  console.log(`👨‍🏫 Teacher Dashboard: http://localhost:${PORT}/teacher/dashboard/dashboard.html`);
  console.log(`👨‍👩‍👧 Parent Dashboard: http://localhost:${PORT}/parent/dashboard/dashboard.html`);
  console.log(`📊 Teacher Analytics: http://localhost:${PORT}/teacher/student-analytics/analytics.html`);
  console.log(`📈 Parent Progress: http://localhost:${PORT}/parent/progress/progress.html`);
  console.log(`\nPress Ctrl+C to stop the server`);
});