const types = ["empty", "wrong-order", "right-order", "wrong-letter"];

export default class Card {
  constructor(elem, letter, type) {
    this.elem = elem;
    this.letter = letter.toUpperCase();
    this.type = type;
  }

  // updates the char and element on screen
  updateLetter(letter) {
    this.letter = letter.toUpperCase();
    this.elem.textContent = this.letter;
    this.elem.classList.remove("inactive");
  }

  // updates the letter to empty and inactive cell
  removeLetter() {
    this.letter = "";
    this.elem.textContent = "";
    this.type = "empty";
    this.elem.classList.add("inactive");
    // remove any class types
    for (let i = 0; i < 4; i++) {
      this.elem.classList.remove(types[i]);
    }
  }

  // cycles through the types
  cycleNextType() {
    this.elem.classList.remove(this.type);
    // wrap around if type is the last in list (make it circular)
    if (this.type == types[types.length - 1]) {
      this.type = types[1]; // skip empty type (default value)
    } else {
      // set type to 1+ index in array
      this.type = types[types.indexOf(this.type) + 1];
    }
    // set classList to card type
    this.elem.classList.add(this.type);
  }

  setToGreen() {
    this.elem.classList.remove("empty");
    this.type = "right-order";
    this.elem.classList.add("right-order");
  }

  setToOrange() {
    this.elem.classList.remove(this.type);
    this.elem.classList.add("wrong-order");
  }

  setToGrey() {
    this.elem.classList.remove(this.type);
    this.elem.classList.add("wrong-letter");
  }
}
