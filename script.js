// Game state variables
let board = [];
let boardSize = 5;
let bombCount = 5;
let diamondCount = 0;
let currentScore = 0;
let bestScore = 0;
let gameOver = false;

// Load best score from localStorage
if (localStorage.getItem('diamondGameBestScore')) {
  bestScore = parseInt(localStorage.getItem('diamondGameBestScore'), 10);
  document.getElementById('bestScore').textContent = bestScore;
}

function startGame() {
  // Read controls
  boardSize = parseInt(document.getElementById('boardSize').value, 10);
  bombCount = parseInt(document.getElementById('bombCount').value, 10);

  if (bombCount >= boardSize * boardSize) {
    alert('Too many bombs!');
    return;
  }

  // Reset state
  board = [];
  diamondCount = boardSize * boardSize - bombCount;
  currentScore = 0;
  gameOver = false;
  document.getElementById('currentScore').textContent = currentScore;

  // Generate board
  let tiles = Array(boardSize * boardSize).fill(0);

  // Place bombs
  let bombPositions = new Set();
  while (bombPositions.size < bombCount) {
    bombPositions.add(Math.floor(Math.random() * tiles.length));
  }
  bombPositions.forEach(pos => tiles[pos] = 2);

  // Place diamonds
  let diamondPlaced = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === 0 && diamondPlaced < diamondCount) {
      tiles[i] = 1;
      diamondPlaced++;
    }
  }

  // Shuffle tiles
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Build 2D board
  for (let r = 0; r < boardSize; r++) {
    board[r] = [];
    for (let c = 0; c < boardSize; c++) {
      board[r][c] = tiles[r * boardSize + c];
    }
  }

  renderBoard();
}

function renderBoard() {
  const boardDiv = document.getElementById('gameBoard');
  boardDiv.innerHTML = '';
  boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const btn = document.createElement('button');
      btn.className = 'tile';
      btn.dataset.row = r;
      btn.dataset.col = c;

      if (board[r][c] === 3) {
        btn.textContent = '💎';
        btn.disabled = true;
        btn.style.background = '#ffd700';
      } else if (board[r][c] === 4) {
        btn.textContent = '💣';
        btn.disabled = true;
        btn.style.background = '#f44336';
        btn.style.color = '#fff';
      } else if (board[r][c] === 5) {
        btn.textContent = '';
        btn.disabled = true;
        btn.style.background = '#eee';
      } else {
        btn.textContent = '?';
        btn.disabled = gameOver;
        btn.onclick = handleTileClick;
      }

      boardDiv.appendChild(btn);
    }
  }
}

function handleTileClick(e) {
  if (gameOver) return;

  const r = parseInt(e.target.dataset.row, 10);
  const c = parseInt(e.target.dataset.col, 10);

  if (board[r][c] === 1) {
    // Diamond
    board[r][c] = 3;
    currentScore++;
    document.getElementById('currentScore').textContent = currentScore;

    if (currentScore > bestScore) {
      bestScore = currentScore;
      document.getElementById('bestScore').textContent = bestScore;
      localStorage.setItem('diamondGameBestScore', bestScore);
    }

    if (currentScore === diamondCount) {
      gameOver = true;
      setTimeout(() => alert('Congratulations! You found all diamonds!'), 100);
    }
  } else if (board[r][c] === 2) {
    // Bomb
    board[r][c] = 4;
    gameOver = true;
    revealAll();
    setTimeout(() => alert('Boom! Game over.'), 100);
  } else {
    board[r][c] = 5;
  }

  renderBoard();
}

function revealAll() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 1) board[r][c] = 3;
      if (board[r][c] === 2) board[r][c] = 4;
    }
  }
}

// Start initial game
startGame();
