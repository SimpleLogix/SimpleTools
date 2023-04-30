import Card from "./card.js";

// Letter frequency from the Oxford Dictionary Word List
const letterFrequency = new Map([
  ["E", 0.126],
  ["T", 0.0937],
  ["A", 0.0834],
  ["O", 0.077],
  ["I", 0.0757],
  ["N", 0.0723],
  ["S", 0.0694],
  ["H", 0.0609],
  ["R", 0.0599],
  ["D", 0.0425],
  ["L", 0.0403],
  ["U", 0.0276],
  ["C", 0.0278],
  ["M", 0.0241],
  ["W", 0.0236],
  ["F", 0.0223],
  ["G", 0.0202],
  ["Y", 0.0197],
  ["P", 0.0193],
  ["B", 0.0149],
  ["V", 0.0098],
  ["K", 0.0077],
  ["J", 0.0015],
  ["X", 0.0015],
  ["Q", 0.001],
  ["Z", 0.0007],
]);

// takes the puzzle a 2D array of [Cards]- representing the words guessed,
// with each letter having a type, being:
// right-order, wrong-order, wrong-letter
// also takes [wordDict], all the 5-letter words in the english dictionary
//? [guesses] - dictionary of word : weight
//
// returns an array of Words the user should guess with probability of
// getting it right
//TODO: fix bug when puzzle is passed a second time... 
//todo: catch any exceptions that might overwrite
// 
export default function findBestGuess(puzzle, guesses) {
  // a map of strings mapped to list of nums that COULD be the index but are not
  // 'yellow types'
  let potentialLetters = new Map();
  // Map of letters in the word and their potential positions (green 'type')
  let includedLetters = new Map();
  // array of letters to exclude (grey 'type)
  let excludedLetters = [];

  //? iterate through each card and check if it is wrong or right order/letter
  // get all excluded letters from puzzle
  // iterate through the rows and columns of the puzzle
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      // if wrong letter [Grey]
      if (puzzle[row][col].type == "wrong-letter") {
        excludedLetters.push(puzzle[row][col].letter);
      }

      // if letter is in the right slot [Green]
      else if (puzzle[row][col].type == "right-order") {
        // set the right order letter to the current index it is sitting in
        includedLetters.set(puzzle[row][col].letter, col);
      }

      // if letter is a potential letter but is out of order:
      //! add index of potential correct pos but we are 'setting' in stead of adding to the list
      //! this could be a problem later on when submitting second word with conflicting orders or
      //! important data could be overwritten.
      //!!! basically figure out how to add to instead  of wring the potential letters array. read in and ++ ??
      else if (puzzle[row][col].type == "wrong-order") {
        //? Get all indexes EXCLUDING current one; since it is wrong order
        //let potentialIndexes = getValuesExcludingNum(col);
        potentialLetters.set(puzzle[row][col].letter, col);
      }
    }
  }

  //? iterate through the guesses and remove words that have excluded letters
  // or have it in the current idx
  // reset words to be removed for the potential letters
  //? words to be eliminated from the list of possible guesses
  let wordsToRemove = [];
  let guessKeys = Array.from(guesses.keys());
  // iterate through all possible guesses
  for (let i = 0; i < guesses.size; i++) {
    // iterate through all the excluded letters
    for (let j = 0; j < excludedLetters.length; j++) {
      // if guess has excluded letter, add to list of words to be removed
      if (guessKeys[i].includes(excludedLetters[j])) {
        //wordsToRemove.push(guesses.keys.get(i));
        wordsToRemove.push(guessKeys[i]);
        j = excludedLetters.length; // break out
      }
    }
  }
  wordsToRemove.forEach((wordToRemove) => {
    guesses.delete(wordToRemove);
  });

  //? Use regex to match words that have the characters in the correct position
  //? or even potential position
  // iterate thru puzzle cards and if a letter
  // is in the right position, add that word to the updatedGuesses
  //? guesses key is a word:weight, letters is letter:index
  let includedRegex = getRegex(includedLetters);
  let wordLetters = Array.from(potentialLetters.keys());
  let updatedGuesses = new Map();
  guesses.forEach(function (value, key, map) {
    // test the regex for words that match the letter position
    if (includedRegex.test(key)) {
      updatedGuesses.set(key, value);
    }
  });
  guesses = updatedGuesses;

  //? filter letters in wrong order
  guesses.forEach(function (value, key, map) {
    // iterate over all potential letters arr
    for (const letter of wordLetters) {
      // if the key contains the letter
      if (key.includes(letter)) {
        // and it is not in an invalid spot
        if (key.indexOf(letter) != potentialLetters.get(letter)) {
          updatedGuesses.set(key, value);
        }
      }
    }
  });
  //? Get a weight for each word
  // Calculate the probability of each letter appearing in a random word
  let topWords = calculateWordChances(guesses);
  return topWords;
}

// takes a num (index) and returns a list of 0-5 excluding the num
// this is only used when determining index that are wrong but contain
// 'potential' values else where
function getValuesExcludingNum(num) {
  // Create an empty array to store the values
  const values = [];

  // Loop from 0 to 5
  for (let i = 0; i < 5; i++) {
    // Check if the current value is equal to the input number
    if (i !== num) {
      // If it's not equal, add it to the array
      values.push(i);
    }
  }
  // Return the array of values
  return values;
}

// Function to calculate the percentage chance of each word
// takes in the list of potential guess and gives a weight,
// then ranks them based on likelihood of being the answer
function calculateWordChances(words) {
  let totalWeight = 0.0;
  // map of word: weight
  let chances = new Map();
  let wordArr = Array.from(words.keys());

  // calculate the total weight first
  for (let i = 0; i < words.size; i++) {
    let weight = calculateWordWeight(wordArr[i]);
    totalWeight += weight;
  }

  //? iterate through each word and assign a base weight
  for (let i = 0; i < words.size; i++) {
    // TODO: Mess with weight
    let weight = calculateWordWeight(wordArr[i]);
    // compare weight with total and turn into percentage
    let balancedWeight = weight / totalWeight;
    chances.set([wordArr[i]], balancedWeight);
  }

  //? calculate the min max & range for scaling up the weight
  let min = Infinity;
  let max = 0;
  // Set min and max
  chances.forEach(function (value, key, map) {
    if (value > max) {
      max = value;
    } else if (value < min) {
      min = value;
    }
  });
  const range = max - min;

  // ? iterate thru chances again and scale up the percentages
  chances.forEach(function (value, key, map) {
    chances[key] = (Math.log10(value - min + 1) / Math.log10(range + 1)) * 100;
  });

  //? sort the results and crop top 10
  let sortedWords = Array.from(chances.keys()).sort(function (a, b) {
    return chances.get(b) - chances.get(a);
  });
  // array of top 10 words (no %'s)
  let topWords = sortedWords.slice(0, 10);

  // find the percentages of the top words
  const filteredMap = new Map();
  topWords.forEach((key) => {
    filteredMap.set(key, (chances.get(key) * 100).toFixed(2));
  });

  return filteredMap;
}

// Function to calculate the weight of a word based on letter frequencies
function calculateWordWeight(word) {
  let weight = 1.0;
  // keep track of letters to balance weight in case of dupes
  let letters = [];
  // iterate through letter by letter and compound the probability
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const freq = letterFrequency.get(word[i]);
    weight *= freq;
    // if word has 2x same letters, -20% weight
    if (letters.length != 0 && letters.includes(letter)) {
      weight *= 0.25;
    }
    letters.push(letter);
  }
  return weight;
}

// returns a regex that matches the letters and their potential index
// takes in map of char : index
// returns a regex that can be used to match words
function getRegex(letters) {
  // dynamically build the regex based on index and letter pos
  let regexString = ["", "", "", "", ""];

  letters.forEach(function (value, key, map) {
    // value is a single index- Guarenteed index
    if (typeof value === "number") {
      regexString[value] = key;
    }
    // value is list- Multiple potential indexes
    // else if (typeof value === "object") {
    //   // loop through the possible indexes and add key to that index in regex
    //   for (let i = 0; i < value.length; i++) {
    //     let potentialIdx = value[i];
    //     regexString[potentialIdx] += key;
    //   }
    // }
  });
  // loop through regex string and clean up regex values
  for (let i = 0; i < regexString.length; i++) {
    if (regexString[i].length == 0) {
      regexString[i] = "."; // any char
    }
    // if (regexString[i].length > 1) {
    //   regexString[i] = splitLetters(regexString[i]);
    // }
  }
  const pattern = regexString.join("");
  const regex = new RegExp(pattern);
  return regex;
}

// takes a string of letters, like "abc"
// and returns the regex pattern for
// matching with any of the letters: "[a|b|c]"
function splitLetters(letters) {
  let regex = "[";
  for (let i = 0; i < letters.length - 1; i++) {
    regex += `${letters[i]}|`;
  }
  regex += `${letters[letters.length - 1]}]`;
  return regex;
}
