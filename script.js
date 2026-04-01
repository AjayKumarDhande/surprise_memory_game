// EmailJS Init
emailjs.init("YjyPdAu3SUn9FZg_p");

const screen = document.getElementById("screen");

// Sample image file names (you will replace with your actual images)
const symbols = [
   "images/1.jpeg",
  "images/2.jpeg",
  "images/3.jpeg",
  "images/4.jpeg",
  "images/5.jpeg",
  "images/6.jpeg",
  "images/7.jpeg",
  "images/8.jpeg",
  "images/9.jpeg",
  "images/10.jpeg"
];

let cards = [...symbols, ...symbols];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let chances = 20;

// One-time play check
if (localStorage.getItem("gameStatus")) {
  showFinal(localStorage.getItem("gameStatus"));
} else {
  showWelcome();
}

// 🎬 Welcome
function showWelcome() {
  screen.innerHTML = `
    <div class="screen">
      <h1>WELCOME MANASA...!!!</h1>
      <button onclick="showInstructions()">Next ➡️</button>
    </div>
  `;
}

// 🎬 Instructions
function showInstructions() {
  screen.innerHTML = `
    <div class="screen">
      <h2>🎮 Instructions</h2>
      <p>You have only <b>20 chances</b></p>
      <p>Match all image pairs to win 🎯</p>
      <p>Win reward: <b>₹10 💰</b></p>
      <button onclick="startGame()">Start Game 🚀</button>
    </div>
  `;
}

// 🎮 Start Game
function startGame() {
  screen.innerHTML = `
    <h3 id="chances"></h3>
    <div class="game-board" id="board"></div>
  `;
  createBoard();
  updateChances();
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  const board = document.getElementById("board");
  shuffle(cards);

  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    // Back side image
    card.innerHTML = `<img src="images/back.png" class="card-img">`;

    card.onclick = flipCard;
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this.classList.contains("matched") || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  // Show front image
  this.innerHTML = `<img src="${this.dataset.symbol}" class="card-img">`;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkMatch();
}

function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    if (document.querySelectorAll(".matched").length === cards.length) {
      endGame("won");
    }
    resetTurn();
  } else {
    chances--;
    updateChances();

    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");

      firstCard.innerHTML = `<img src="images/back.png" class="card-img">`;
      secondCard.innerHTML = `<img src="images/back.png" class="card-img">`;

      if (chances === 0) endGame("lost");

      resetTurn();
    }, 700);
  }
}

function updateChances() {
  document.getElementById("chances").innerText = "Chances Left: " + chances;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// 🎉 Final result
function endGame(status) {
  localStorage.setItem("gameStatus", status);

  let message = status === "won"
    ? "🎉 Congrats Manasa! You won and will receive ₹10 soon 💖"
    : "😢 Sorry Manasa, you lost. This game can be played only once.";

  sendEmail(status);
  showFinal(status, message);
}

function showFinal(status, message) {
  screen.innerHTML = `
    <div class="screen">
      <h1>${status === "won" ? "🎉 YOU WON!" : "😢 YOU LOST!"}</h1>
      <p>${message}</p>
    </div>
  `;
}

// 📧 Email
function sendEmail(status) {
  emailjs.send("service_3heegsj", "template_8odmpsj", {
    to_email: "dandeajaykumar34@gmail.com",
    name: "Manasa",
    result: status,
    message: status === "won"
      ? "Manasa WON the Memory Game 🎉"
      : "Manasa LOST the Memory Game 😢"
  });
}
