// x and y are the operands entered by user to be used in the calculation
let x = 0.0;
let y = 0.0;

// string representation of operands to build numbers dynamically
let op_1 = "0";
let op_2 = "";
let operation = "";
//string of the entire operation
let current_operation = "";
// pointer to the current operand
let current_op = 1;

//grab the current output on the screen
const inputElement = document.getElementById("input");
const operationElement = document.getElementById("op");
updateOutput(op_1, current_operation);

// adds the digit clicked to a str var (op_1 / op_2) to build a number as the user clicks
function digitClicked(num) {
  // add digit to op_1 or 2 depending on pointer
  if (current_op == 1) {
    // if pressing 0 when there is already a first zero; ignore- don't add 0's
    if (op_1 == "0") {
      //? op_1 == 0 means there is no value (or 0) in the first operand
      // if num is a period, only add 1 max
      if (num == "." && !op_1.includes(".")) {
        op_1 += num;
      } else if (num != "0") {
        // remove the zero if its the first input
        op_1 = num;
      }
      updateOutput(op_1, current_operation);
    } else {
      // append digit to the operand if under char limit
      if (op_1.length < 20) {
        if (num == ".") {
          // only append 1 period
          if (!op_1.includes(".")) {
            op_1 += num;
          }
        } else {
          op_1 += num;
        }
        updateOutput(op_1, current_operation);
      }
    }
  }
  // do the same for op_2
  else {
    if (op_2 == "0") {
      if (num == "." && !op_2.includes(".")) {
        op_2 += num;
      } else if (num != "0") {
        op_2 = num;
      }
      updateOutput(op_2, current_operation);
    } else {
      if (op_2.length < 20) {
        if (num == ".") {
          if (!op_2.includes(".")) {
            op_2 += num;
          }
        } else {
          op_2 += num;
        }
        updateOutput(op_2, current_operation);
      }
    }
  }
}

// set the operation to the selected operation
function operationClicked(op) {
  // save operation and operators
  x = parseFloat(op_1, current_operation);
  operation = op;
  current_operation = op_1 + " " + operation;
  current_op = 2;
  // reset the second operand
  op_2 = "0";
  updateOutput(op_2, current_operation);
}

// runs the result of the ops given the operation
function result() {
  // grab the second op and reset it's string buffer
  y = parseFloat(op_2);
  xRef = x; // ref to old x for updating output
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
    case "x":
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
  current_op = 1; //? incase delete/add digits or other ops
  current_operation = `${xRef} ${operation} ${y}`;
  op_1 = x.toString();
  updateOutput(x, current_operation);
}

// deletes digit from operand
function del() {
  if (current_op == 1) {
    if (op_1.length > 1) {
      op_1 = op_1.slice(0, -1);
    } else {
      op_1 = "01";
    }
    updateOutput(op_1, current_operation);
  } else {
    if (op_2.length > 1) {
      op_2 = op_2.slice(0, -1);
    } else {
      op_2 = "0";
    }
    updateOutput(op_2, current_operation);
  }
}

// clear operand 1 or 2 based on current op pointer
function clearOp() {
  current_op == 1 ? (op_1 = "0") : (op_2 = "0");
  updateOutput("0", current_operation);
}

// reset params
function clearEverything() {
  current_op = 1;
  op_1 = "0";
  x = y = 0;
  op_2 = current_operation = operation = "";
  operationElement.textContent = "";
  updateOutput("0", current_operation);
}

// negates numbers; positive become negative and versa
function negate() {
  if (current_op == 1) {
    let number = parseFloat(op_1) * -1;
    op_1 = number.toString();
    updateOutput(op_1, current_operation);
  } else {
    let number = parseFloat(op_2) * -1;
    op_2 = number.toString();
    updateOutput(op_2, current_operation);
  }
}

//? updates the text displayed; could be operands or result
// input- what the user is currently typing into the calculator
// operation- the op being performed (op_1 + operation); serves as a reminder for last op
function updateOutput(userInput, operation) {
  if (operation == "") {
    // still on the first op; don't display operations
    inputElement.textContent = userInput;
  } else {
    inputElement.textContent = userInput;
    operationElement.textContent = operation;
  }
}
