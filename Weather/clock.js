// function that sets the current time and date on the display
function currentTime() {
  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let session = "AM";

  // 12 hour format
  if (hh === 0) {
    hh = 12;
  }
  if (hh > 12) {
    hh = hh - 12;
    session = "PM";
  }

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;

  // format time and date
  const options = { weekday: "long", month: "long", day: "numeric" };
  let time = hh + ":" + mm + " " + session;
  const formattedDate = new Date().toLocaleDateString(undefined, options);

  document.getElementById("time").innerText = time;
  document.getElementById("date").innerText = formattedDate;
  let t = setTimeout(function () {
    currentTime();
  }, 1000);
}

currentTime();
