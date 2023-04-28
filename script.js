// document elements
const popup = document.getElementById("popup");
const gridItems = document.getElementsByClassName("grid-item");

// cursor location
let x = (y = 0);

// grabs cursor x and y positions
const onMouseMove = (e) => {
  x = e.pageX;
  y = e.pageY;
};

document.addEventListener("mousemove", onMouseMove);

// iterate through grid items to add event listeners to each
// to catch when user enters mouse in or out
for (const item of gridItems) {
  // on mouse in, enable popup
  item.addEventListener("mousemove", function () {
    popup.style.display = "flex";
    popup.style.left = x + "px";
    popup.style.top = y + "px";
  });
  // disable after mouse leaves item
  item.addEventListener("mouseout", function () {
    popup.style.display = "none";
  });
}
