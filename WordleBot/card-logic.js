import Card from "./card.js";
import findBestGuess from "./algorithm.js";

// the column of 5 words to be filled
const wordsContainerElem = document.getElementById("words-container");
const modeToggleSwitch = document.getElementById("mode");
const guessBoard = document.getElementById("guess-board");

// array of letter representing the puzzle
let puzzle = [];
// random word to be generated for the game
let randomWord = "";
// massive array of 5K+ 5-letter words
let wordsDict = {};
// pointers to card being interacted with
let activeRow = 0;
let activeCard = 0; // 'col' within the activeRow

//? there are 2 main states;
//? user is typing- cards cant be clicked, only kb input allowed
//? user is evaluating- cards can be clicked but no input until user submits
let userTyping = true;

//? There are two modes; game and bot; play or solve
let isBotMode = true;
// array of words and their prob. to guess if bot mode is enabled
let guesses = {};

// current word being typed
const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

//? Inner class to hold the guess element, which is really:
//? Word, divider, chance
class GuessElem {
  constructor(word, divider, chance) {
    this.word = word;
    this.divider = divider;
    this.chance = chance;
  }
}
//? This is an array that will hold all of the guess
//? and their elements
let guessElems = [];

//! MAIN
// read in file used to create a guess and provide inferred guesses
readWordsFile().then((words) => {
  // set a random word
  wordsDict = words;
  guesses = wordsDict;
  randomWord = pickRandomWord();
  // draw the cards to the screen then listen for input
  modeToggleSwitch.checked = isBotMode;
  modeToggleSwitch.addEventListener("click", switchModes);
  drawCards();
  drawGuessBoard();
  resetGuessBoard();
  document.addEventListener("keydown", handleKeyboardEvent);
});

// function to handle keyboard events
function handleKeyboardEvent(event) {
  // if the key pressed is a letter:
  if (letters.includes(event.key)) {
    addLetterToCard(event.key);
  }
  // if the key pressed is delete
  else if (event.key == "Backspace") {
    removeLetterFromCard();
  }
  // if the key pressed is Enter
  else if (event.key == "Enter") {
    submitWord();
  }
}

// function that switches the modes when user toggles
function switchModes() {
  isBotMode = !isBotMode;
  resetCards();
  if (!isBotMode) {
    randomWord = pickRandomWord();
    guessBoard.style.display = "none";
  } else {
    guessBoard.style.display = "flex";
  }
}

// resets the board and removes all the card values
function resetCards() {
  userTyping = true; //? 'edit mode' must be true to make changes to cards
  activeRow = 4;
  activeCard = 5; //? 5 b/c remove letter decrements first so it is actually 4
  // iterate thru all cards used
  for (let i = 0; i < 25; i++) {
    removeLetterFromCard();
    // set ptr to start of prev row  if we reach the end
    if (activeCard == 0) {
      activeRow--;
      activeCard = 5;
    }
  }
  activeCard = 0;
  activeRow = 0;
}

// adds letter to card and moves pointer down
function addLetterToCard(letter) {
  if (userTyping && activeCard < 5) {
    // update card internally
    puzzle[activeRow][activeCard].updateLetter(letter);
    // THEN increment pointer
    activeCard++;
  }
}

// removes letter from card and decrements ptr
function removeLetterFromCard() {
  if (userTyping && activeCard > 0) {
    // decrement pointer
    activeCard--;
    // THEN update card internally
    puzzle[activeRow][activeCard].removeLetter();
  }
}

// ran when user hits enter
function submitWord() {
  // if == 4; we've reached the end of the word; can submit
  if (userTyping && activeCard == 5) {
    userTyping = false;
  }

  // second submit checks if user picked all options for the letters
  if (isBotMode && userSelectedAllCards()) {
    updateGuessValues();
    moveToNextRow();
    userTyping = true;
  }

  // game mode and user is not typing (because we reached the end)
  if (!isBotMode && !userTyping) {
    handleSubmitForGameMode();
  }
}

// updates the internal list of words to guess and their chances
// this is called when the user submits a word and the algorithm
// tries to find the next best word to guess using the context clues
function updateGuessValues() {
  guesses = findBestGuess(puzzle, guesses);

  // update the UI to reflect the new guesses
  updateGuessBoard();
}

//checks if the user selected an option/type for all cards in the row before moving down
function userSelectedAllCards() {
  // iterate through the row and check each card's type
  for (let i = 0; i < 5; i++) {
    // if the type is empty, it hasn't been selected
    if (puzzle[activeRow][i].type == "empty") {
      return false;
    }
  }
  return true;
}

// move pointers to the next row and reset active card ptr
function moveToNextRow() {
  activeRow++;
  activeCard = 0;
}

// creates 5 rows of 5 card elements on the screen
function drawCards() {
  // iterate thru 5 rows
  for (let i = 0; i < 5; i++) {
    // create a word-row element to hold the row of (5 cards)
    const wordRow = document.createElement("div");
    wordRow.classList.add("word-row");
    // array of Cards (obj not element) to be filled and pushed into the puzzle
    let wordArray = [];
    // create the 5 cards (letters)
    for (let j = 0; j < 5; j++) {
      // create a card element and wrap it around a Card obj
      const letterCardElem = document.createElement("div");
      letterCardElem.classList.add("letter");
      letterCardElem.classList.add("inactive");
      wordRow.appendChild(letterCardElem);
      const letterCard = new Card(letterCardElem, "", "empty");
      wordArray.push(letterCard);
      // add listeners to the card
      letterCardElem.addEventListener("click", function () {
        handleCardClick(i, letterCard);
      });
    }
    // add the row element to the document and puzzle
    wordsContainerElem.appendChild(wordRow);
    puzzle.push(wordArray);
  }
}

// checks if user is evaluating cards and cycle through the types
function handleCardClick(row, card) {
  // if the card clicked is the active card
  if (!userTyping && isBotMode) {
    if (row == activeRow) {
      card.cycleNextType();
    }
  }
}

// creates a new game, with a random word
function pickRandomWord() {
  const rng = Math.floor(Math.random() * wordsDict.size);
  const word = Array.from(wordsDict.keys())[rng];
  return word;
}

// runs tests to see if the user word matches the word to be guessed
function handleSubmitForGameMode() {
  // construct word from row
  //let word = buildWordFromCards(activeRow);

  // check if the word matches
  const allCardsAreGreen = checkLetterPositions();

  if (!allCardsAreGreen) {
    userTyping = true;
  }
  // move to next row
  moveToNextRow();
}

// checks if the letter the user entered is in the right slot or not
function checkLetterPositions() {
  // iterate through active row in puzzle
  for (let i = 0; i < 5; i++) {
    const guessedLetter = puzzle[activeRow][i].letter;
    // if letters match random word => set to green
    if (guessedLetter == randomWord[i]) {
      puzzle[activeRow][i].setToGreen();
    }
    // if letters are in word but don't match...
    else if (randomWord.includes(guessedLetter)) {
      puzzle[activeRow][i].setToOrange();
    }
    // else; letter is not in word
    else {
      puzzle[activeRow][i].setToGrey();
    }
  }
  return false;
}

// creates the guess board ui with the words
// user should guess and their probabilities
function drawGuessBoard() {
  for (let i = 0; i < 10; i++) {
    // create the elements
    const guessContainerElem = document.createElement("div");
    const guessElem = document.createElement("div");
    const dividerElem = document.createElement("div");
    const chanceElem = document.createElement("div");

    // add the classes and styles
    guessContainerElem.classList.add("guess-container");

    // add elements to container and container to doc
    guessContainerElem.appendChild(guessElem);
    guessContainerElem.appendChild(dividerElem);
    guessContainerElem.appendChild(chanceElem);
    guessBoard.appendChild(guessContainerElem);

    // add elements to an object into an arr to keep track
    const guess = new GuessElem(guessElem, dividerElem, chanceElem);
    guessElems.push(guess);
  }
}

// Updates the ui context to match internal guess list
function updateGuessBoard() {
  resetGuessBoard();

  let guessArr = Array.from(guesses.keys());
  let chanceArr = Array.from(guesses.values());

  // set elements to the guesses
  for (let i = 0; i < guesses.size; i++) {
    if (guesses.size > 0) {
      guessElems[i].word.textContent = guessArr[i];
      guessElems[i].divider.classList.add("divider");
      guessElems[i].chance.textContent = chanceArr[i] + " %";
    }
  }
}

// resets the ui guess elements
function resetGuessBoard() {
  for (let i = 0; i < guessElems.length; i++) {
    const element = guessElems[i];
    element.word.textContent = "";
    element.divider.classList.remove("divider");
    element.chance.textContent = "";
  }
}

// opens file to read in words
function readWordsFile() {
  return fetch("sgb-words.txt")
    .then((response) => response.text())
    .then((data) => {
      let words = data.split("\n");
      const newGuessesMap = new Map();
      words.forEach((word) => {
        newGuessesMap.set(word.toUpperCase(), 0);
      });
      return newGuessesMap;
    });
}
