// const variables used to set the display parameters on the size
const body = document.body;
const gridElement = document.getElementById("grid");
const slider = document.getElementById("gridSizeSlider");
const sliderSizeElement = document.getElementById("gridSizeText");
const colorPicker = document.getElementById("colorPicker");
const eraserTool = document.getElementById("eraser");
const grayscaleTool = document.getElementById("gray-scale");
const rainbowTool = document.getElementById("rainbow");
const radioButtonOnePx = document.getElementById("brushSize1");
const radioButtonTwoPx = document.getElementById("brushSize2");
const radioButtonFourPx = document.getElementById("brushSize4");

// internal vars
const sizeDict = {
  8: "88px",
  16: "44px",
  32: "22px",
  64: "11px",
};
const colors = [
  "rgba(255, 71, 87,1.0)",
  "rgba(255, 99, 72,1.0)",
  "rgba(255, 165, 2,1.0)",
  "rgba(255, 242, 0,1.0)",

  "rgba(255, 107, 129,1.0)",
  "rgba(255, 127, 80,1.0)",
  "rgba(236, 204, 104,1.0)",
  "rgba(255, 250, 101,1.0)",

  "rgba(46, 213, 115,1.0)",
  "rgba(30, 144, 255,1.0)",
  "rgba(83, 82, 237,1.0)",
  "rgba(111, 30, 81,1.0)",

  "rgba(50, 255, 126,1.0)",
  "rgba(24, 220, 255,1.0)",
  "rgba(112, 161, 255,1.0)",
  "rgba(131, 52, 113,1.0)",

  "rgba(217, 128, 250,1.0)",
  "rgba(139, 90, 54, 1.0)",
  "rgba(236, 240, 241,1.0)",
  "rgba(61, 61, 61,1.0)",

  "rgba(253, 167, 223,1.0)",
  "rgba(195, 137, 100, 1)",
  "rgba(189, 195, 199,1.0)",
  "rgba(89, 98, 117,1.0)",
];
let selectedColor = colors[0];
let isMouseDown = false;
let isGrayScaleMode = false;
let isRainbowMode = false;
let randomColors = []; // this is generated when user chooses rainbow mode
let randomColorIdx = 0; // keep track of position in randomColors array
let grayScaleColors = [
  "rgba(255, 255, 255, 1)",
  "rgba(225, 225, 225, 1)",
  "rgba(211, 211, 211, 1)",
  "rgba(189, 189, 189, 1)",
  "rgba(158, 158, 158, 1)",
  "rgba(125, 125, 125, 1)",
  "rgba(105, 105, 105, 1)",
  "rgba(50, 50, 50, 1)",
  "rgba(0, 0, 0, 1)",
];
let brushSize = 1;
// internal 2D grid to keep track of colors that were put down
let grid = [[]];

// set the initial size to 2 (16x16)
setGridSize(2);
loadColorsIntoColorPicker();
setEraserPatternGrid();
deselectAllRadioButton();
radioButtonOnePx.checked = true;

//? listeners to catch when user changes tools
// add a listener to the slider for input changes
slider.value = 2;
slider.addEventListener("input", function () {
  setGridSize(this.value);
});
// add listeners to the color modes
eraserTool.addEventListener("click", function () {
  // set color to transparent to remove any colors in the grid
  selectedColor = "transparent";
  removeAllSelectedBorders();
  // set border to 'selected'
  this.classList.add("mode-item-selected");
  // deselect other tools
  isGrayScaleMode = isRainbowMode = false;
});
rainbowTool.addEventListener("click", function () {
  removeAllSelectedBorders();
  this.classList.add("mode-item-selected");
  // turn on rainbow mode + disable other tools
  isRainbowMode = true;
  isGrayScaleMode = false;
  // generate the random colors
  randomColors.length = 0;
  for (let i = 0; i < 100; i++) {
    const rng = Math.floor(Math.random() * 25);
    randomColors.push(colors[rng]);
  }
});
grayscaleTool.addEventListener("click", function () {
  removeAllSelectedBorders();
  this.classList.add("mode-item-selected");
  // turn on grayscale mode + disable other tools
  isGrayScaleMode = true;
  isRainbowMode = false;
  selectedColor = grayScaleColors[4];
});

//? listeners to catch when user changes brush size
radioButtonOnePx.addEventListener("click", function () {
  deselectAllRadioButton();
  radioButtonOnePx.checked = true;
  brushSize = 1;
});
radioButtonTwoPx.addEventListener("click", function () {
  deselectAllRadioButton();
  radioButtonTwoPx.checked = true;
  brushSize = 2;
});
radioButtonFourPx.addEventListener("click", function () {
  deselectAllRadioButton();
  radioButtonFourPx.checked = true;
  brushSize = 4;
});

//? listeners to catch when user stops pressing down on mouse
// add a listened to the grid for mouse activities
gridElement.addEventListener("mousedown", function () {
  isMouseDown = true;
});
gridElement.addEventListener("mouseup", function () {
  isMouseDown = false;
});
// catch user mouse outside grid
body.addEventListener("mouseup", function () {
  isMouseDown = false;
});

// sets the size of the grid and inner cells
// takes in sliderInput (1-4)
function setGridSize(sliderInput) {
  // slider is 1-4; convert that into 8,16,32,64...
  // calculate the dimensions from the slider input
  let size = 4;
  for (let i = 0; i < sliderInput; i++) {
    size *= 2;
  }
  // set the internal grid colors
  grid.length = 0;
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(""); // set initial value to transparent
    }
    grid.push(row);
  }
  // before we set the grid, remove the old cell elements
  const oldCells = document.querySelectorAll(".cell");
  for (let i = 0; i < oldCells.length; i++) {
    oldCells[i].remove();
  }
  // set the row and columns to the selected size
  gridElement.style.gridTemplateRows = `repeat(${size}, ${sizeDict[size]})`;
  gridElement.style.gridTemplateColumns = `repeat(${size}, ${sizeDict[size]})`;
  sliderSizeElement.textContent = `${size} x ${size}`;
  // Dynamically add however many cells are required to fill the grid
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    let pos = getRowColumnFromIndex(i, size);
    cell.classList.add("cell");
    //? set color of cell to selected color on mouse enter
    cell.addEventListener("mouseover", function () {
      // Find neighbors of this cell
      const neighbors = gatherNeighborCells(i);
      for (const neighbor of neighbors) {
        gridElement.children[neighbor].style.backgroundColor = selectedColor;
      }
      if (isMouseDown) {
        updateCellColor();
      }
    });
    //? reset to original color on mouse exit
    cell.addEventListener("mouseout", function () {
      const neighbors = gatherNeighborCells(i);
      if (isMouseDown) {
        updateCellColor();
      } else {
        //? user is hovering
        // reset cell and neighbors back to color they were
        for (const neighbor of neighbors) {
          const neighborPos = getRowColumnFromIndex(neighbor, size);
          gridElement.children[neighbor].style.backgroundColor =
            grid[neighborPos.row][neighborPos.col];
        }
      }
    });
    //? mouse up get called on the last cell (fixes bug with it not getting colored)
    cell.addEventListener("mouseup", function () {
      updateCellColor();
    });
    //? set to color on click
    cell.addEventListener("click", function () {
      updateCellColor();
    });
    gridElement.appendChild(cell);
    // internal function to manage cells within the grid;
    // checks which color should be selected by checking tool selected
    // get neighboring cells based on brush size
    // change the grid colors
    // update the internal grid to keep track of changes
    function updateCellColor() {
      selectedColor = checkForSelectedTools();
      const neighbors = gatherNeighborCells(i);
      for (const neighbor of neighbors) {
        const neighborPos = getRowColumnFromIndex(neighbor, size);
        updateGridColors(neighborPos, selectedColor);
        gridElement.children[neighbor].style.backgroundColor = selectedColor;
      }
    }
  }
}

// updates the color in the internal 2D grid
function updateGridColors(pos, color) {
  grid[pos.row][pos.col] = color;
}

//checks if rainbow or grayscale tool is on and updates the selected color accordingly
function checkForSelectedTools() {
  if (isRainbowMode) {
    // select the next random color
    selectedColor = randomColors[randomColorIdx];
    if (randomColorIdx == 100) {
      randomColorIdx = 0; // reset
    } else {
      randomColorIdx++;
    }
    return selectedColor;
  } else if (isGrayScaleMode) {
    const rng = Math.floor(Math.random() * 8);
    return grayScaleColors[rng];
  } else {
    return selectedColor;
  }
}

// loads color picker with colors
function loadColorsIntoColorPicker() {
  for (let i = 0; i < 24; i++) {
    // create the color cell to be inserted into the color picker grid
    const colorCell = document.createElement("div");
    colorCell.classList.add("color");
    colorCell.style.backgroundColor = colors[i];
    // if first color, set to selected
    if (i == 0) {
      colorCell.classList.add("color-selected");
    }
    // add a listened to change the color if clicked
    colorCell.addEventListener("click", function () {
      // iterate through the color elements and reset the borders for non-selected
      removeAllSelectedBorders();
      selectedColor = colors[i];
      colorCell.classList.add("color-selected");
    });
    colorPicker.append(colorCell);
  }
}

// removes all of the selected borders;
// runs when user selects new color or tool
function removeAllSelectedBorders() {
  for (let j = 0; j < colorPicker.children.length; j++) {
    // remove the selected border from all the colors
    colorPicker.children[j].classList.add("color");
    colorPicker.children[j].classList.remove("color-selected");
  }
  eraserTool.classList.remove("mode-item-selected");
  grayscaleTool.classList.remove("mode-item-selected");
  rainbowTool.classList.remove("mode-item-selected");
}

// function to create a checkerboard-grid pattern
function setEraserPatternGrid() {
  for (let i = 0; i < 72; i++) {
    if (i % 2 == 0) {
      const white = document.createElement("div");
      white.style.backgroundColor = "white";
      eraserTool.append(white);
    } else {
      const gray = document.createElement("div");
      gray.style.backgroundColor = "gray";
      eraserTool.append(gray);
    }
  }
}

// calculates the neighboring cells based on 2D grid and brush size
// takes in index of cell being looked ad
// returns a map of neighbors' index
function gatherNeighborCells(index) {
  const gridSize = grid.length;
  // neighbors are stored in an array an are added to based on conditions
  let neighbors = [index];

  if (brushSize == 1) {
    return neighbors;
  }

  // get left neighbor:
  let left = index - 1;
  // if index out of bounds
  if (left % gridSize != gridSize - 1 && left >= 0) {
    neighbors.push(left); // setting to index to avoid out of bounds
  }
  // get upstairs neighbor:
  let up = index - gridSize;
  if (up >= 0) {
    neighbors.push(up);
  }

  // get right neighbor:
  let right = index + 1;
  if (right % gridSize != 0) {
    neighbors.push(right);
  }

  // get downstairs neighbor:
  let down = index + gridSize;
  if (down < gridSize * gridSize) {
    neighbors.push(down);
  }

  // check if diagonal neighbors exist:
  if (brushSize == 4) {
    // get LTRB neighbor:
    left = index - 2;

    if (index % gridSize > 1) {
      neighbors.push(left); // setting to index to avoid out of bounds
    }

    up = index - gridSize * 2;
    if (up >= 0) {
      neighbors.push(up);
    }

    right = index + 2;
    if (right % gridSize > 1) {
      neighbors.push(right);
    }
    down = index + gridSize * 2;
    if (down < gridSize * gridSize) {
      neighbors.push(down);
    }

    // get diagonal neighbors
    let topLeft = index - (gridSize + 1); // -1 left -16 up
    if (topLeft >= 0 && index % gridSize != 0) {
      neighbors.push(topLeft);
    }

    let topRight = index - (gridSize - 1); // +1 right -16 up
    if (topRight > 0 && index % gridSize != gridSize - 1) {
      neighbors.push(topRight);
    }
    let bottomRight = index + (gridSize + 1); // +1 right +16 down
    if (bottomRight > 0 && index % gridSize != gridSize - 1) {
      // last cell; don't add
      neighbors.push(bottomRight);
    }

    let bottomLeft = index + (gridSize - 1);
    if (bottomLeft > 0 && index % gridSize > 0) {
      neighbors.push(bottomLeft);
    }
  }

  return neighbors;
}
1;

function clearGrid() {
  setGridSize(slider.value);
}

function deselectAllRadioButton() {
  radioButtonOnePx.checked = false;
  radioButtonTwoPx.checked = false;
  radioButtonFourPx.checked = false;
}

function convert2DgridToImage() {
  // Initialize a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = grid.length * grid.length ; // Replace with the width of your 2D array
  canvas.height = grid.length * grid.length ; // Replace with the height of your 2D array
  const ctx = canvas.getContext("2d");

  // Loop through your 2D array and set each pixel on the canvas
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const rgba = grid[y][x];
      ctx.fillStyle = rgba;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Create a link element to download the image
  const link = document.createElement("a");
  link.download = "image.png";
  link.href = canvas.toDataURL("image/png");

  // Simulate a click on the link to download the image
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// returns row and column based on the index of a flattened 2D array
function getRowColumnFromIndex(index, numCols) {
  const row = Math.floor(index / numCols);
  const col = index % numCols;
  return { row, col };
}
