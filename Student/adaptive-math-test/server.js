const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/adaptive_test")
mongoose.connection.on("connected", ()=> console.log("MongoDB connected"))

// Import Question model
const Question = require("./models/Question")

// Adaptive test variables
let difficulty = 1       // start with Medium
let score = 0
let askedQuestions = []
let questionCount = 0
const MAX_QUESTIONS = 10   // total questions per test

// API: Get next question
app.get("/question", async (req,res)=>{
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
        console.error("Database error in /question:", error);
        res.status(500).json({ error: "Database error" });
    }
})

// API: Submit answer and update score + difficulty
app.post("/answer", async (req,res)=>{
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
        console.error("Database error in /answer:", error);
        res.status(500).json({ error: "Database error" });
    }
})

// Test endpoint to verify database connectivity
app.get("/test-db", async (req, res) => {
    try {
        const count = await Question.countDocuments();
        res.json({ message: `Database connected. ${count} questions found.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// Reset test endpoint
app.post("/reset", (req, res) => {
    console.log("Test reset requested");
    difficulty = 2;       // reset to Medium
    score = 0;
    askedQuestions = [];
    questionCount = 0;
    res.json({ message: "Test reset successfully" });
});
// Only listen when run directly, not when required as module
if (require.main === module) {
    app.listen(3000, () => console.log("Server running on port 3000"))
}

module.exports = app;