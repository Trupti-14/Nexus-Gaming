const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
    difficulty: Number, // 1=Easy, 2=Medium, 3=Hard
    topic: String
})

module.exports = mongoose.model("Question", QuestionSchema)