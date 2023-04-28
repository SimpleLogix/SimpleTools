//! HTML elements
const actionButtonA = document.getElementById("button-one");
const actionButtonB = document.getElementById("button-two");
const gamePausedText = document.getElementById("game-paused-text");
const gameScore = document.getElementById("score-text");
const gamePlayGridElement = document.getElementById("game-play-side");

//! local vars
let gamePaused = true;
let player;
let grid = []; // initialize the grid with 12
let appleIdx = 0;
let score = 0;
const DIMENSIONS = 12;

//! Inner Class
//---------------------------------
/**
 * Cell within the game play grid;
 * [idx, row, and col] to keep track of pos in grid
 * [type] can be: empty, head, body,
 */
class Cell {
  constructor(idx, row, col, type) {
    this.idx = idx;
    this.row = row;
    this.col = col;
    this.type = type;
  }
}
/** */
class Player {
  constructor(head, body, direction) {
    // pointer to front of snake
    this.head = head;
    // array to where body is
    this.body = body;
    // direction of the head
    this.direction = direction;
  }
  addCellToBody(idx) {
    // add to end of body

    this.body.push(idx);
  }
}

//! Main
//----------------------------

//? add listeners to elements
// listen for when user pauses the game and display the element to let them know
actionButtonB.addEventListener("click", pauseGame);
document.addEventListener("keydown", handleKeydownEvent);

//? initialize the game play loop
initializeGame();
setInterval(mainGameLoop, 300);

//! Functions
//----------------------------------

// pauses the game loop
function pauseGame() {
  gamePaused = !gamePaused;
  gamePausedText.style.display = "none";
  if (gamePaused) {
    gamePausedText.style.display = "block";
  }
}

// ran at start of game to initialize the game loop elements
function initializeGame() {
  //? create a 10x10 grid to play in
  // ensure the grid is the right dimensions
  gamePlayGridElement.style.gridTemplateColumns = `repeat(${DIMENSIONS}, auto)`;
  gamePlayGridElement.style.gridTemplateRows = `repeat(${DIMENSIONS}, auto)`;

  for (let i = 0; i < DIMENSIONS * DIMENSIONS; i++) {
    // get row and col from idx
    const row = Math.floor(i / DIMENSIONS);
    const col = i % DIMENSIONS;

    // create a cell element and add it to the grid
    const div = document.createElement("div");
    div.classList.add("cell");
    gamePlayGridElement.appendChild(div);

    // add cell to internal grid array
    const cell = new Cell(i, row, col, "empty");
    grid.push(cell);
  }

  //? create the player and add them to the screen
  let randomRow = Math.floor(Math.random() * DIMENSIONS);
  let randomCol = Math.floor(Math.random() * DIMENSIONS);

  // update internal grid
  let idx = randomRow * DIMENSIONS + randomCol;
  grid[idx] = new Cell(idx, randomRow, randomCol, "head");

  // set player head to new random location
  player = new Player(grid[idx], [], "right");
  updatePlayerOnGrid(player);

  // spawn an apple
  spawnRandomApple();

  // unpause the game
  pauseGame();
}

// main game loop that is run in intervals of 1 sec
// player automatically moves while doc listens for keyboard events
// some quick parameters are checked when player moves
// as well as after to see if collision is detected
function mainGameLoop() {
  if (!gamePaused) {
    movePlayer();
    detectAppleCollision();
    detectSelfCollision();
  }
}

//
function handleKeydownEvent(event) {
  switch (event.key) {
    // move left
    case "a":
    case "A":
    case "ArrowLeft":
      event.preventDefault();
      if (player.direction != "right") {
        player.direction = "left";
      }
      break;
    // move right
    case "d":
    case "D":
    case "ArrowRight":
      event.preventDefault();
      if (player.direction != "left") {
        player.direction = "right";
      }
      break;
    // move up
    case "w":
    case "W":
    case "ArrowUp":
      event.preventDefault();
      if (player.direction != "down") {
        player.direction = "up";
      }
      break;
    // move down
    case "s":
    case "S":
    case "ArrowDown":
      event.preventDefault();
      if (player.direction != "up") {
        player.direction = "down";
      }
      break;
    // pause game
    case " ":
      pauseGame();
      break;
    default:
      break;
  }
}

// calculates the player's next square and where the body follows
//? moves head only
function movePlayer() {
  //move player head
  let newX = player.head.col;
  let newY = player.head.row;

  switch (player.direction) {
    case "left":
      newX = player.head.col - 1;
      break;
    case "right":
      newX = player.head.col + 1;
      break;
    case "up":
      newY = player.head.row - 1;
      break;
    case "down":
      newY = player.head.row + 1;
      break;
    default:
      break;
  }

  // if head moves out of bounds right on x-axis
  if (newX == DIMENSIONS) {
    newX = 0;
  }
  // if head moves out of bounds left on x-axis
  else if (newX < 0) {
    newX = DIMENSIONS - 1;
  } else if (newY == DIMENSIONS) {
    newY = 0;
  } else if (newY < 0) {
    newY = DIMENSIONS - 1;
  }
  let newHead = new Cell(newY * DIMENSIONS + newX, newY, newX, "head");
  let updatedPlayer = new Player(newHead, [], player.direction);

  //update elements
  updatePlayerOnGrid(updatedPlayer);
}

function moveHead() {}

function moveBody() {}

// draws the player's head and body based on grid
function updatePlayerOnGrid(updatedPlayer) {
  // draw head on grid
  gamePlayGridElement.children[updatedPlayer.head.idx].classList.add(
    "head-cell"
  );
  // remove old head if position updates
  if (updatedPlayer.head.idx != player.head.idx) {
    gamePlayGridElement.children[player.head.idx].classList.remove("head-cell");
  }
  // update the internal vars
  grid[updatedPlayer.head.idx] = updatedPlayer.head;
  player = updatedPlayer;
}

// spawns an apple randomly in the grid
function spawnRandomApple() {
  do {
    appleIdx = Math.floor(Math.random() * DIMENSIONS * DIMENSIONS);
  } while (appleIdx != player.head.idx);
  {
    appleIdx = Math.floor(Math.random() * DIMENSIONS * DIMENSIONS);
  }
  gamePlayGridElement.children[appleIdx].classList.add("apple-cell");
}

// removes the current apple internally and from grid
function despawnApple() {
  gamePlayGridElement.children[appleIdx].classList.remove("apple-cell");
}

function detectAppleCollision() {
  if (player.head.idx == appleIdx) {
    score++;
    gameScore.textContent = score;
    player.addCellToBody(appleIdx);
    despawnApple();
    spawnRandomApple();
  }
}

function detectSelfCollision() {}
