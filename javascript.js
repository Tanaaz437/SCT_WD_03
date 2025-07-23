const questionText = document.getElementById("question-text");
const optionsForm = document.getElementById("options-form");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const finalScore = document.getElementById("final-score");

const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resultsBox = document.getElementById("results");

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

function loadQuestion() {
  reset();
  const q = questions[currentQuestion];
  questionText.textContent = q.question;
  progress.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  scoreEl.textContent = `Score: ${score}`;

  if (q.type === "radio") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="option" value="${opt}"> ${opt}`;
      optionsForm.appendChild(label);
    });
  } else if (q.type === "checkbox") {
    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" name="option" value="${opt}"> ${opt}`;
      optionsForm.appendChild(label);
    });
  } else if (q.type === "fill") {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "option";
    optionsForm.appendChild(input);
  }

  startTimer();
}

function startTimer() {
  timeLeft = 30;
  timerEl.textContent = `${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

function reset() {
  optionsForm.innerHTML = "";
  nextBtn.disabled = true;
  submitBtn.disabled = false;
  clearInterval(timer);
}

function checkAnswer() {
  clearInterval(timer);
  const q = questions[currentQuestion];
  let userAnswer;

  if (q.type === "radio") {
    const selected = document.querySelector("input[name='option']:checked");
    userAnswer = selected?.value;
    if (userAnswer === q.answer) score++;
  }

  else if (q.type === "checkbox") {
    const selected = [...document.querySelectorAll("input[name='option']:checked")].map(e => e.value);
    const correct = q.answer;
    if (
      selected.length === correct.length &&
      selected.every(opt => correct.includes(opt))
    ) score++;
  }

  else if (q.type === "fill") {
    const input = document.querySelector("input[name='option']");
    userAnswer = input.value.trim().toLowerCase();
    if (userAnswer === q.answer.toLowerCase()) score++;
  }

  submitBtn.disabled = true;
  nextBtn.disabled = false;
}

submitBtn.addEventListener("click", checkAnswer);

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showResults();
  } else {
    loadQuestion();
  }
});

function showResults() {
  document.querySelector(".question-box").style.display = "none";
  document.querySelector(".controls").style.display = "none";
  document.querySelector(".info").style.display = "none";
  resultsBox.classList.remove("hidden");
  finalScore.textContent = `Your Score: ${score}/${questions.length}`;
}

window.onload = loadQuestion;
