let cards = [];
let players = [];
let assignments = [];
let currentPlayerIndex = 0;
let imposterIndex;

async function loadCards() {
  const response = await fetch("cards.json");
  cards = await response.json();
}
loadCards();

function addPlayer() {
  const name = document.getElementById("playerName").value.trim();
  if (name) {
    players.push(name);
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById("playerList").appendChild(li);
    document.getElementById("playerName").value = "";
  }
}

function startGame() {
  if (players.length < 2) {
    alert("Need at least 2 players!");
    return;
  }

  const sharedCard = cards[Math.floor(Math.random() * cards.length)];
  const sharedWord = sharedCard.name;
  const sharedKey = sharedCard.key;

  assignments = new Array(players.length).fill({ word: sharedWord, key: sharedKey });

  imposterIndex = Math.floor(Math.random() * players.length);
  assignments[imposterIndex] = { word: "You are the imposter!", key: "imposter" };

  currentPlayerIndex = 0;

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("wordScreen").classList.remove("hidden");
  showPlayer();
}

function showPlayer() {
  const name = players[currentPlayerIndex];
  const { word } = assignments[currentPlayerIndex];

  document.getElementById("currentPlayer").innerText = `${name}'s turn`;
  document.getElementById("word").innerText = word;
  document.getElementById("word").classList.add("hidden");

  const container = document.getElementById("cardImageContainer");
  container.innerHTML = "";
  container.classList.add("hidden");
}

function toggleWord() {
  const { key } = assignments[currentPlayerIndex];
  const container = document.getElementById("cardImageContainer");

  document.getElementById("word").classList.toggle("hidden");
  container.classList.toggle("hidden");

  const img = document.createElement("img");
  img.id = "cardImage";
  img.alt = "Card image";
  img.style.width = "220px";
  img.style.border = "4px solid #1B98E0";
  img.style.borderRadius = "12px";
  img.style.boxShadow = "0 0 25px rgba(0,0,0,0.4)";
  img.style.marginTop = "10px";
  img.style.marginBottom = "25px";

  const fileName = key === "imposter"
    ? "imposter.png"
    : key.toLowerCase().replace(/[\s\.\-]/g, "-") + ".png";

  img.src = "cards-150/" + fileName;
  container.innerHTML = "";
  container.appendChild(img);
}

function nextPlayer() {
  currentPlayerIndex++;
  if (currentPlayerIndex < players.length) {
    showPlayer();
  } else {
    document.getElementById("wordScreen").classList.add("hidden");
    document.getElementById("revealScreen").classList.remove("hidden");
  }
}

function showImposter() {
  document.getElementById("revealScreen").classList.add("hidden");
  document.getElementById("resultScreen").classList.remove("hidden");
  document.getElementById("imposter").innerText = players[imposterIndex];
}

function restartGame() {
  assignments = [];
  currentPlayerIndex = 0;
  imposterIndex = null;

  document.getElementById("resultScreen").classList.add("hidden");
  document.getElementById("setup").classList.add("hidden");
  startGame();
}
