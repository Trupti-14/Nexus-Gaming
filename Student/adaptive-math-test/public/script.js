let currentQuestion;
let questionNumber = 0;

async function loadQuestion() {
    try {
        const res = await fetch("question");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const q = await res.json();

        if (q.message) {
            // Test finished or no questions
            let resultClass = q.finalScore >= 20 ? 'correct' : 'incorrect';
            document.getElementById("questionBox").innerHTML = `
                <h3 class="result-message ${resultClass}">${q.message}</h3>
                <p class="final-score">Final Score: ${q.finalScore || 0} points</p>
                <p>Questions Answered: ${questionNumber}</p>
                <button class="option-btn" onclick="resetTest()" style="margin-top: 24px;">Take Test Again</button>
            `;
            return;
        }

        questionNumber++;
        currentQuestion = q;

        // Update progress info
        document.getElementById("question-counter").textContent = `Question ${questionNumber}`;

        // Build HTML for question + options
        let optionsHTML = q.options.map((option, index) =>
            `<button class="option-btn" onclick="submitAnswer('${option}')">${option}</button>`
        ).join('');

        document.getElementById("questionBox").innerHTML = `
            <h3>${q.question}</h3>
            <div class="options-grid">
                ${optionsHTML}
            </div>
        `;
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById("questionBox").innerHTML = `
            <h3 class="result-message incorrect">Error loading question</h3>
            <p>${error.message}</p>
            <button class="option-btn" onclick="loadQuestion()" style="margin-top: 24px;">Try Again</button>
        `;
    }
}

async function submitAnswer(ans) {
    try {
        const res = await fetch("answer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                questionId: currentQuestion._id,
                answer: ans
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        // Update score on frontend
        document.getElementById("score").textContent = result.currentScore;

        // Update difficulty display
        const difficultyNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
        document.getElementById("difficulty-level").textContent = `Difficulty: ${difficultyNames[result.nextDifficulty] || 'Medium'}`;

        // Show feedback
        let feedbackClass = result.correct ? 'correct' : 'incorrect';
        let feedbackText = result.correct ? 'Correct! ✓' : 'Incorrect ✗';

        document.getElementById("questionBox").innerHTML = `
            <h3 class="result-message ${feedbackClass}">${feedbackText}</h3>
            <p>Score: ${result.currentScore} | Difficulty: ${difficultyNames[result.nextDifficulty]}</p>
            <button class="option-btn" onclick="loadQuestion()" style="margin-top: 24px;">Next Question</button>
        `;

        // Auto-advance after 2 seconds
        setTimeout(() => {
            loadQuestion();
        }, 2000);

    } catch (error) {
        console.error("Submit answer error:", error);
        document.getElementById("questionBox").innerHTML = `
            <h3 class="result-message incorrect">Error submitting answer</h3>
            <p>${error.message}</p>
            <button class="option-btn" onclick="loadQuestion()" style="margin-top: 24px;">Continue</button>
        `;
    }
}

async function resetTest() {
    try {
        // Reset server-side state
        const res = await fetch("/adaptive-test/reset", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            throw new Error(`Reset failed (status ${res.status})`);
        }

        // Reset client-side state
        questionNumber = 0;
        currentQuestion = null;
        document.getElementById("score").textContent = "0";
        document.getElementById("question-counter").textContent = "Question 1";
        document.getElementById("difficulty-level").textContent = "Difficulty: Medium";

        // Load first question
        await loadQuestion();
    } catch (error) {
        console.error("Reset error:", error);
        document.getElementById("questionBox").innerHTML = `
            <h3 class="result-message incorrect">Error resetting test</h3>
            <p>${error.message}</p>
            <button class="option-btn" onclick="resetTest()" style="margin-top: 24px;">Try Again</button>
        `;
    }
}

// Initialize the test
document.addEventListener('DOMContentLoaded', function() {
    // The test will start when user clicks "Start Test" button
});

// Start test
loadQuestion();