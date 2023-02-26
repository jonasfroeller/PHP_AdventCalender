// Door Shutter
/* Thanks to https://stackoverflow.com/questions/56467558/trying-to-create-a-camera-shutter-effect-with-divs */
let plates = 8;
let r = 80,
  arc = (x, y, s) => `A${r},${r},0,0,${s},${x},${y}`,
  path = (i, d) =>
    `<path transform='rotate(${(i / plates) * 360})' ${d}></path>`;

function animateShutter(val, indx) {
  let step = Math.PI * (0.5 + 2 / plates);
  let p1x = Math.cos(step) * r;
  let p1y = Math.sin(step) * r;
  let cos = Math.cos(-val);
  let sin = Math.sin(-val);
  let c1x = p1x - cos * p1x - sin * p1y;
  let c1y = p1y - cos * p1y + sin * p1x;
  let dx = -sin * r - c1x;
  let dy = r - cos * r - c1y;
  let dc = Math.sqrt(dx * dx + dy * dy);
  let a = Math.atan2(dy, dx) - Math.acos(dc / 2 / r);
  let x = c1x + Math.cos(a) * r;
  let y = c1y + Math.sin(a) * r;

  if (indx == -1) {
    for (let index = 0; index < 24; index++) {
      createShutter(index);
    }
  } else {
    createShutter(indx);
  }

  function createShutter(indx) {
    let edge = `M${p1x},${p1y}${arc(0, r, 0)}${arc(x, y, 1)}`;
    let edges = document.getElementsByClassName("edges")[indx];
    bodies = document.getElementsByClassName("bodies")[indx];
    bodies.innerHTML = "";
    edges.innerHTML = bodies.innerHTML;
    for (let i = 0; i < plates; i++) {
      edges.innerHTML += path(i, `fill=none stroke=black d='${edge}'`);
      if (i % 2 == 0) {
        bodies.innerHTML += path(
          i,
          `fill=#A40C04 d='${edge}${arc(p1x, p1y, 0)}'`
        );
      } else {
        bodies.innerHTML += path(
          i,
          `fill=white d='${edge}${arc(p1x, p1y, 0)}'`
        );
      }
    }
  }
}

insertClosedDoors();

function insertClosedDoors() {
  animateShutter(1 * 1.04, -1);
}

function openDoor(shutterIndex) {
  let shutterValue = 1;
  let shutterAnimation = setInterval(() => {
    animateShutter(shutterValue * 1.04, shutterIndex);
    if (shutterValue > 0) {
      shutterValue -= 0.01;
    }
    if (shutterValue < 0) {
      shutterValue = 0;
      clearInterval(shutterAnimation);
    }
  }, 12.5);
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

var calenderDoorsElements = document.getElementsByClassName(
  "calenderDoorWrapper"
);
if (calenderDoorsElements) {
  console.info("Elements with class 'calenderDoor' found!");
  var calenderDoors = [...calenderDoorsElements];
  calenderDoors.forEach((calenderDoor) => {
    /* calenderDoor.addEventListener("click", function () {
      console.info(`Door ${calenderDoors.indexOf(calenderDoor) + 1} clicked`);
      door = calenderDoors.indexOf(calenderDoor);
      if (
        document
          .getElementsByClassName("calenderDoorWrapper")
          [door].getAttribute("data-open") == "false"
      ) {
        requestDoorContent(door);
      }
    }); */

    calenderDoor.addEventListener(
      "click",
      debounce(function () {
        console.info(`Door ${calenderDoors.indexOf(calenderDoor) + 1} clicked`);
        door = calenderDoors.indexOf(calenderDoor);
        if (
          document
            .getElementsByClassName("calenderDoorWrapper")
            [door].getAttribute("data-open") == "false"
        ) {
          requestDoorContent(door);
        }
      }, 250)
    );
  });
} else {
  console.error("No elements with class 'calenderDoor' found!");
}

function requestDoorContent(door) {
  let xhttp = new XMLHttpRequest();

  xhttp.onloadend = function () {
    if (xhttp.status == 404) {
      console.log("Not found! " + xhttp.responseText);
    } else {
      console.log(xhttp.responseText);
    }
  };

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let dataString = this.responseText;
      if (
        dataString != "error" &&
        document
          .getElementsByClassName("calenderDoorWrapper")
          [door].getAttribute("data-open") == "false"
      ) {
        document
          .getElementsByClassName("calenderDoorWrapper")
          [door].setAttribute("data-open", "true");
        document.getElementsByClassName("calenderDoorWrapper")[
          door
        ].style = `background-image: url('../img/imageBorderPlusPlus/${dataString}'); background-repeat: no-repeat; background-size: contain; background-position: center;`;
        openDoor(door);
      } else {
        console.log("invalid day");
        document.getElementsByClassName("message")[0].style = "display: flex;";
        document.documentElement.style =
          "pointer-events: none; cursor: not-allowed;";
        setTimeout(() => {
          document.getElementsByClassName("message")[0].style = "display: none";
          document.documentElement.style =
            "pointer-events: all; cursor: default;";
        }, 2500);
      }
    }
  };

  xhttp.open("GET", `./adventkalender-api.php?door=${door}`, true);

  xhttp.send();
}
