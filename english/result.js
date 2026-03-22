const scoreText = document.getElementById("scoreText");
const percentageText = document.getElementById("percentageText");
const stars = document.getElementById("stars");
const feedback = document.getElementById("feedbackMessage");

let score = localStorage.getItem("englishScore") || 0;
let total = 5;

scoreText.innerText = score + " / " + total;

let percent = Math.round((score / total) * 100);

percentageText.innerText = percent + "%";

if(percent >= 90){

stars.innerText = "⭐⭐⭐⭐⭐";
feedback.innerText = "Excellent! You mastered this topic.";

}

else if(percent >= 70){

stars.innerText = "⭐⭐⭐⭐";
feedback.innerText = "Great job! Keep practicing.";

}

else if(percent >= 50){

stars.innerText = "⭐⭐⭐";
feedback.innerText = "Good effort! Try again to improve.";

}

else if(percent >= 30){

stars.innerText = "⭐⭐";
feedback.innerText = "You need more practice.";

}

else{

stars.innerText = "⭐";
feedback.innerText = "Watch the lesson again and retry the quiz.";

}