let score = 0;
let level = 1;
let timeLeft = 10;
let timer;
let currentParts = [];
let answered = false;

// 🎯 Generate expression (ALWAYS 2+ operations)
function generateExpression() {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  let c = Math.floor(Math.random() * 10) + 1;

  // 🟢 LEVEL 1 → Only + and -
  if (level === 1) {
    let ops = ["+", "-"];
    let op1 = ops[Math.floor(Math.random() * 2)];
    let op2 = ops[Math.floor(Math.random() * 2)];

    return [a + "", op1, b + "", op2, c + ""];
  }

  // 🟡 LEVEL 2 → Include × or ÷ (decision needed)
  if (level === 2) {
    let ops = ["+", "-", "×", "÷"];
    let op1 = ops[Math.floor(Math.random() * 4)];
    let op2 = ["×", "÷"][Math.floor(Math.random() * 2)]; // force priority

    return [a + "", op1, b + "", op2, c + ""];
  }

  // 🔴 LEVEL 3 → Brackets
  if (level >= 3) {
    let ops = ["+", "-", "×", "÷"];
    return [
      "(",
      a + "",
      ops[Math.floor(Math.random() * 4)],
      b + "",
      ")",
      "×",
      c + "",
    ];
  }
}

// Display expression
function displayExpression() {
  document.getElementById("question").innerText = currentParts.join(" ");
}

// 🎯 Get correct operation index (BODMAS)
function getCorrectIndex() {
  // 1️⃣ Brackets first
  let start = currentParts.indexOf("(");
  let end = currentParts.indexOf(")");

  if (start !== -1 && end !== -1) {
    return start + 2;
  }

  // 2️⃣ Multiplication / Division
  for (let i = 1; i < currentParts.length; i += 2) {
    if (currentParts[i] === "×" || currentParts[i] === "÷") return i;
  }

  // 3️⃣ Addition / Subtraction
  return 1;
}

// 🎯 Create options (ALWAYS multiple if possible)
function createOptions() {
  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  let optionsCount = 0;

  for (let i = 1; i < currentParts.length - 1; i += 2) {
    let op = currentParts[i];

    if (["+", "-", "×", "÷"].includes(op)) {
      let left = currentParts[i - 1];
      let right = currentParts[i + 1];

      // skip brackets symbols
      if (left === "(" || right === ")") continue;

      let btn = document.createElement("button");
      btn.innerText = `${left} ${op} ${right}`;

      btn.onclick = () => handleClick(i, btn);

      optionsDiv.appendChild(btn);
      optionsCount++;
    }
  }

  // fallback if only 1 operation remains
  if (optionsCount === 0 && currentParts.length === 3) {
    let btn = document.createElement("button");
    btn.innerText = `${currentParts[0]} ${currentParts[1]} ${currentParts[2]}`;
    btn.onclick = () => handleClick(1, btn);
    optionsDiv.appendChild(btn);
  }
}

// Calculate
function calculate(a, op, b) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return (a / b).toFixed(2);
}

// Handle click
function handleClick(index, btn) {
  if (answered) return;

  answered = true;
  clearInterval(timer);

  let correctIndex = getCorrectIndex();

  if (index === correctIndex) {
    btn.classList.add("correct");

    let result = calculate(
      currentParts[index - 1],
      currentParts[index],
      currentParts[index + 1],
    );

    document.getElementById("feedback").innerText = "✅ Correct!";
    document.getElementById("explanation").innerText =
      `${currentParts[index - 1]} ${currentParts[index]} ${currentParts[index + 1]} = ${result}`;

    currentParts.splice(index - 1, 3, result + "");

    // remove brackets after solving
    currentParts = currentParts.filter((x) => x !== "(" && x !== ")");

    score += 10;

    // 🎯 Level progression
    if (score >= 50 && score < 100) level = 2;
    if (score >= 100) level = 3;
  } else {
    btn.classList.add("wrong");

    document.getElementById("feedback").innerText = "❌ Wrong!";
    document.getElementById("explanation").innerText =
      "Follow BODMAS: Brackets → Division/Multiplication → Addition/Subtraction";
  }

  updateStats();
}

// Update stats
function updateStats() {
  document.getElementById("score").innerText = score;
  document.getElementById("level").innerText = level;
}

// Timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  answered = false;

  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("feedback").innerText = "⏰ Time Up!";
      answered = true;
    }
  }, 1000);
}

// Next step
function nextStep() {
  if (currentParts.length <= 1 || !answered) {
    currentParts = generateExpression();
  }

  displayExpression();
  createOptions();
  startTimer();

  document.getElementById("feedback").innerText = "";
  document.getElementById("explanation").innerText = "";
}

// Attach button event
document.getElementById("nextBtn").addEventListener("click", nextStep);

// Start game
currentParts = generateExpression();
nextStep();
