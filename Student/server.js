const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB for adaptive test
mongoose.connect("mongodb://127.0.0.1:27017/adaptive_test")
mongoose.connection.on("connected", ()=> console.log("MongoDB connected for adaptive test"))

// Import Question model
const Question = require('./adaptive-math-test/models/Question');

// Adaptive test variables
let difficulty = 2       // start with Medium
let score = 0
let askedQuestions = []
let questionCount = 0
const MAX_QUESTIONS = 10   // total questions per test

// Serve static files for each student module
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));
app.use('/profile', express.static(path.join(__dirname, 'profile')));
app.use('/settings', express.static(path.join(__dirname, 'settings')));
app.use('/notifications', express.static(path.join(__dirname, 'notifications')));
app.use('/achievements', express.static(path.join(__dirname, 'achievements')));
app.use('/leaderboard', express.static(path.join(__dirname, 'leaderboard')));
app.use('/awareness', express.static(path.join(__dirname, 'awareness')));
app.use('/awareness-quiz', express.static(path.join(__dirname, 'awareness-quiz')));
app.use('/awareness-video', express.static(path.join(__dirname, 'awareness-video')));
app.use('/chapter-detail', express.static(path.join(__dirname, 'chapter-detail')));
app.use('/education', express.static(path.join(__dirname, 'education')));

// Serve static files for adaptive-math-test
app.use('/adaptive-test', express.static(path.join(__dirname, 'adaptive-math-test/public')));

// Adaptive test API routes
app.get('/adaptive-test/question', async (req, res) => {
    console.log("Question request received, current difficulty:", difficulty);
    try {
        if(questionCount >= MAX_QUESTIONS){
            return res.json({
                message: "Test Finished",
                finalScore: score
            })
        }

        const q = await Question.findOne({
            difficulty: difficulty,
            _id: { $nin: askedQuestions }
        })

        if(!q){
            console.log("No question found for difficulty:", difficulty);
            return res.json({ message: "No more questions available for this difficulty" })
        }

        console.log("Question found:", q.question);
        askedQuestions.push(q._id)
        questionCount++

        res.json(q)
    } catch (error) {
        console.error("Database error in /adaptive-test/question:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/adaptive-test/answer', async (req, res) => {
    console.log("Answer submission received");
    try {
        const {questionId, answer} = req.body
        const q = await Question.findById(questionId)

        let correct = false
        if(answer === q.correctAnswer){
            correct = true
            score += q.difficulty
            difficulty = Math.min(difficulty + 1, 3)  // increase difficulty
        } else {
            difficulty = Math.max(difficulty - 1, 1)  // decrease difficulty
        }

        console.log("Answer processed, correct:", correct, "new difficulty:", difficulty);
        res.json({
            correct,
            currentScore: score,
            nextDifficulty: difficulty,
            questionsAnswered: questionCount
        })
    } catch (error) {
        console.error("Database error in /adaptive-test/answer:", error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post('/adaptive-test/reset', (req, res) => {
  console.log('Resetting adaptive test state');
  difficulty = 2;
  score = 0;
  askedQuestions = [];
  questionCount = 0;
  res.json({ success: true, message: 'Adaptive test reset' });
});

app.get('/adaptive-test/test-db', async (req, res) => {
    try {
        const count = await Question.countDocuments();
        res.json({ message: `Database connected. ${count} questions found.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Default route - redirect to dashboard
app.get('/', (req, res) => {
  res.redirect('/dashboard/dashboard.html');
});

// Handle 404 for student routes
app.use('/student/*', (req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404 - Student Page Not Found</title></head>
    <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
      <h1>404 - Student Page Not Found</h1>
      <p>The requested student page was not found.</p>
      <p><a href="/dashboard/dashboard.html">Go to Student Dashboard</a></p>
    </body>
    </html>
  `);
});

// API endpoints for student functionality (placeholder)
app.get('/api/student/progress', (req, res) => {
  res.json({ message: "Student progress API - to be implemented" });
});

app.get('/api/student/achievements', (req, res) => {
  res.json({ message: "Student achievements API - to be implemented" });
});

app.get('/api/student/leaderboard', (req, res) => {
  res.json({ message: "Student leaderboard API - to be implemented" });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Student server running on http://localhost:${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard/dashboard.html`);
});