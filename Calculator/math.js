// x and y are the operands and z is the solution
let x = 0;
let y = 0;
let z = 0;

// string representation of operands to build numbers dynamically
let op_1 = "0";
let op_2 = "";
let operation = "";
//pointer
let current_op = op_1;

//grab the current output on the screen
const output = document.getElementById("output");
updateOutput(op_1);

// adds numbers to a str var (op_1 / op_2) to build a number as the user clicks
function number_clicked(num) {
  // if operation == 0, user is still entering first op
  if (operation.length == 0) {
    // if pressing 0 when there is already a first zero; don't add 0's
    if (op_1 == "0") {
      if (num != 0) {
        // remove the zero if its the first input
        op_1 = num;
        output.textContent = op_1;
      }
    } else {
      op_1 += num;
      output.textContent = op_1;
    }
  }
  // else add number_clicked to the second op
  else {
    // if pressing 0 when there is already a first zero; don't add 0's
    if (op_) {
      if (num != 0) {
        // remove the zero if its the first input
        op_2 = num;
        output.textContent = op_2;
      }
    } else {
      op_2 += num;
      output.textContent = op_2;
    }
  }
}

// set the operation to the selected operation
function operation_clicked(op) {
  // save operation and operators
  x = parseInt(op_1);
  operation = op;
  current_op = op_2;
  // reset the second operand
  op_2 = "0";
}

// runs the result of the ops given the operation
function result() {
  // grab the second op and reset it's string buffer
  y = parseInt(op_2);
  // check which operation to perform
  switch (operation) {
    case "+":
      // put result into x (the new op_1)
      x = x + y;
      break;
    case "-":
      // put result into x (the new op_1)
      x = x - y;
      break;
    case "*":
      // put result into x (the new op_1)
      x = x * y;
      break;
    case "/":
      // put result into x (the new op_1)
      x = x / y;
      break;
    default:
      break;
  }
  // set op_1 to result to listen for a second operation
  op_1 = x.toString();
  updateOutput(x);
}

function del() {}

function updateOutput(text) {
  output.textContent = text;
}
