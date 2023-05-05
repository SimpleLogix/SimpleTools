let sunMass = 150;
let solarSystem = {};
let stars = [];
// possible colors for stars
const starsHex = [
  [249, 202, 36],
  [240, 147, 43],
  [235, 77, 75],
  [106, 176, 76],
  [199, 236, 238],
  [126, 214, 223],
  [224, 86, 253],
  [255, 255, 255],
];
// map of hex colors for planets
const planetsHex = {
  Sun: [255, 230, 102],
  Mercury: [176, 176, 176],
  Venus: [238, 201, 110],
  Earth: [51, 153, 255],
  Mars: [255, 102, 0],
  Belt: [238, 200, 144],
  Jupiter: [243, 166, 131],
  Saturn: [152, 245, 255],
  Uranus: [51, 102, 255],
  Neptune: [229, 229, 229],
  Pluto: [48, 57, 82],
};
const planetNames = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Belt",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

const G = 9.8;
// star ossiclating factor
let destabilizeFactor = 0.00008;
let rotations = 0;

//ui buttons
const btnWidth = 72;
let backBtn;

//TODO: ADD MOONS AND MOON ORBITS

//todo: add hover on planets
// maybe a small box with planet info
// can update when a mouse enters a planet and dissapears after a set amount of timeSinceHover

function preload() {
  backBtn = loadImage("../assets/arrow.png");
}

// set up the canvas, sun, and planets
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-parent");

  // takes a num: distance from sun
  // returns a vector of [x,y] coords in the space
  function getPlanetPos(distanceFromSun) {
    const theta = (PI * 3) / 2;
    let planetPos = createVector(
      distanceFromSun * cos(theta),
      distanceFromSun * sin(theta)
    );
    return planetPos;
  }

  // use the mean orbital equation to get velocity needed for a perfect orbit
  // takes the distance from the sun and
  // vel ~ sqrt(G * mass of sun / r)
  function getPlanetVel(distanceFromSun, attractionMass) {
    let posVec = getPlanetPos(distanceFromSun);
    let planetVel = posVec.copy();
    planetVel.rotate(HALF_PI);
    planetVel.setMag(sqrt((G * attractionMass) / posVec.mag()));
    return planetVel;
  }

  // takes an array of R, G, B values and returns a color
  function colorFromRGB(rgb) {
    return color(rgb[0], rgb[1], rgb[2]);
  }

  // set the solar system map,
  solarSystem = {
    Sun: {
      body: new Body(
        "Sun",
        sunMass,
        createVector(0, 0),
        createVector(0, 0),
        colorFromRGB(planetsHex.Sun)
      ),
      children: planetNames,
    },
    Mercury: {
      body: new Body(
        "Mercury",
        8,
        getPlanetPos((sunMass * 3) / 4),
        getPlanetVel((sunMass * 3) / 4, sunMass),
        colorFromRGB(planetsHex.Mercury)
      ),
      children: [],
      rotations: 0,
    },
    Venus: {
      body: new Body(
        "Venus",
        19,
        getPlanetPos(sunMass),
        getPlanetVel(-sunMass, sunMass),
        colorFromRGB(planetsHex.Venus)
      ),
      children: [],
      rotations: 0,
    },
    Earth: {
      body: new Body(
        "Earth",
        20,
        getPlanetPos(sunMass * 1.2),
        getPlanetVel(sunMass * 1.2, sunMass),
        colorFromRGB(planetsHex.Earth)
      ),
      children: [],
      rotations: 0,
    },
    Mars: {
      body: new Body(
        "Mars",
        10,
        getPlanetPos(sunMass * 1.5),
        getPlanetVel(sunMass * 1.5, sunMass),
        colorFromRGB(planetsHex.Mars)
      ),
      children: [],
      rotations: 0,
    },
    Belt: {
      body: new Body(
        "Belt",
        3,
        getPlanetPos(sunMass * 1.75),
        getPlanetVel(-sunMass * 1.75, sunMass),
        colorFromRGB(planetsHex.Belt)
      ),
      children: [],
    },
    Jupiter: {
      body: new Body(
        "Jupiter",
        120,
        getPlanetPos(sunMass * 2.5),
        getPlanetVel(sunMass * 2.5, sunMass),
        colorFromRGB(planetsHex.Jupiter)
      ),
      children: [],
      rotations: -1,
    },
    Saturn: {
      body: new Body(
        "Saturn",
        100,
        getPlanetPos(sunMass * 3.3),
        getPlanetVel(sunMass * 3.3, sunMass),
        colorFromRGB(planetsHex.Saturn)
      ),
      children: [],
      rotations: -1,
    },
    Uranus: {
      body: new Body(
        "Uranus",
        65,
        getPlanetPos(sunMass * 3.85),
        getPlanetVel(sunMass * 3.85, sunMass),
        colorFromRGB(planetsHex.Uranus)
      ),
      children: [],
      rotations: -1,
    },
    Neptune: {
      body: new Body(
        "Neptune",
        60,
        getPlanetPos(sunMass * 4.35),
        getPlanetVel(sunMass * 4, sunMass),
        colorFromRGB(planetsHex.Neptune)
      ),
      children: [],
      rotations: -1,
    },
    Pluto: {
      body: new Body(
        "Pluto",
        5,
        getPlanetPos(sunMass * 5.2),
        getPlanetVel(sunMass * 5, sunMass),
        colorFromRGB(planetsHex.Pluto)
      ),
      children: [],
      rotations: -1,
    },
    ShootingStar1: {
      body: new Body(
        "ShootingStar1",
        5,
        createVector(0, 0),
        createVector(0, 0),
        color(245)
      ),
      children: [],
    },
    ShootingStar2: {
      body: new Body(
        "ShootingStar2",
        5,
        createVector(0, 0),
        createVector(0, 0),
        color(245)
      ),
      children: [],
    },
    ShootingStar3: {
      body: new Body(
        "ShootingStar3",
        5,
        createVector(0, 0),
        createVector(0, 0),
        color(245)
      ),
      children: [],
    },

    // Moons
    // earthMoon: {
    //   body: new Body(
    //     5,
    //     getPlanetPos(125),
    //     getPlanetVel(125, 20),
    //     color(229, 229, 229)
    //   ),
    //   children: [],
    // },
  };

  // add more glow to the sun
  solarSystem["Sun"]["body"].glow = 50;
  // increate the tail of the belt
  solarSystem["Belt"]["body"].c = 700;

  // populate the stars array with bodies
  for (let i = 0; i < 6 ** 2; i++) {
    // randomize position in the screen
    let positionVec = createVector(
      random(0, width - 10),
      random(0, height - 10)
    );
    let starSize = random(2, 8);
    // pick random color : weighted
    let rngColor = floor(random(0, 200));
    if (rngColor >= 0 && rngColor < 40) {
      rngColor = floor(rngColor / 10);
    } else if (rngColor >= 40 && rngColor < 70) {
      rngColor = 5;
    } else if (rngColor >= 70 && rngColor < 100) {
      rngColor = 6;
    } else if (rngColor >= 100) {
      rngColor = 7;
    }
    // add the star to the stars array
    stars.push(
      new Body(
        "Star",
        starSize,
        positionVec,
        createVector(0, 0),
        colorFromRGB(starsHex[rngColor])
      )
    );
  }
}

// Update positions of bodies and draw to the screen
function draw() {
  // consts
  let leftBorder = -width / 2;
  const bottomBorder = height / 2;
  const padding = 22;
  const margin = 85;

  // takes an array of R, G, B values and returns a color
  function colorFromRGB(rgb) {
    return color(rgb[0], rgb[1], rgb[2]);
  }

  // draw the bg and the stars on top
  background(19, 15, 64);

  stars.forEach(function (star, idx, array) {
    star.show();
    star.drawStar();
  });

  // move center of solar system to center of screen
  translate(width / 2, bottomBorder);

  // draw and update position of each planet and moon
  for (let body in solarSystem) {
    let planet = solarSystem[body]["body"];
    let children = solarSystem[body]["children"];
    for (let child in children) {
      planet.attract(solarSystem[children[child]]["body"]);
    }
    planet.show();
    planet.update();
    // iterate through children and add attraction
    // update rotations var if earth completes 1 full orbit
    if (
      body != "Belt" &&
      planetNames.includes(body) &&
      dist(planet.pos.x, planet.pos.y, planet.initPos.x, planet.initPos.y) < 2
    ) {
      solarSystem[body]["rotations"] += 1;
    }
  }

  // ui components
  textSize(18);
  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = color(255);
  text("FPS: " + floor(frameRate()), -leftBorder - 80, -bottomBorder + 40);

  // add buttons to canvas
  // back btn
  drawingContext.shadowBlur = 12;
  drawingContext.shadowColor = color(255);
  image(backBtn, leftBorder + 20, -bottomBorder + 20, btnWidth, btnWidth);

  // add rotation text
  textSize(26);
  //letter spacing from CSS
  fill(255);
  drawingContext.shadowBlur = 1;
  text("Rotations: ", leftBorder + 25, bottomBorder - 45);
  //reset color
  fill(color(255));

  leftBorder += 110;
  let i = 1;
  for (let planet in solarSystem) {
    if (solarSystem[planet].rotations !== undefined) {
      // display text
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = solarSystem[planet]["body"]._color;
      fill(colorFromRGB(planetsHex[planet]));
      ellipse(leftBorder + margin * i, bottomBorder - 55, 20, 20);
      text(
        solarSystem[planet].rotations,
        leftBorder + margin * i + padding,
        bottomBorder - 44
      );
      i++;
    }
  }
}

function mouseClicked() {
  // if position of back btn
  if (
    mouseX > 20 &&
    mouseX < 20 + btnWidth &&
    mouseY > 20 &&
    mouseY < 20 + btnWidth
  ) {
    window.location = "..";
  }
}

//
// Body of mass representing either a planet of a sun
class Body {
  constructor(name, mass, pos, vel, _color) {
    this.name = name;
    this.mass = mass;
    this.pos = pos;
    this.initPos = pos.copy();
    this.vel = vel;
    this.r = this.mass;
    this.c = 150;
    this.path = [];
    this._color = _color;
    this.glow = 5;
    this.subtracting = true;

    // displays the sun/planets and their tails onto canvas
    this.show = function () {
      // set tail blur/glow to 0 for perf.
      drawingContext.shadowBlur = 0;
      let inc = this.name == "Belt"? 12 : 3;
      for (let i = 0; i < this.path.length - 2; i += inc) {
        if (mass == 3) {
          strokeWeight(6);
        } else {
          strokeWeight(this.mass / 9);
        }
        stroke(_color);

        line(
          this.path[i].x,
          this.path[i].y,
          this.path[i + 1].x,
          this.path[i + 1].y
        );
      }
      fill(_color);
      // reset back to glow factor for planet body
      drawingContext.shadowBlur = this.glow;
      drawingContext.shadowColor = _color;
      ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    };

    //updates the planet position
    this.update = function () {
      // increment position by velocity
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.path.push(this.pos.copy());

      // if path gets longer than a certain amount, cut it off
      if (this.path.length > this.c) {
        this.path.splice(0, 1);
      }
    };

    this.drawStar = function () {
      const rng = random(0, 1000);
      // subtract until we get to 0
      if (this.subtracting && this.mass > 0) {
        this.mass -= destabilizeFactor * 800;
      }
      // if we get to 0, add until we get to 10
      if (!this.subtracting && this.mass < 10) {
        this.mass += destabilizeFactor * 800;
        // Do something with the mass variable here
      }
      // Check if we've reached the end of the current phase
      if (this.mass <= 0 && this.subtracting) {
        this.subtracting = false;
        // set new pos and color for the star
        this.pos = createVector(random(0, width - 10), random(0, height - 10));
      } else if (this.mass > rng && !this.subtracting) {
        this.subtracting = true;
      }
    };

    // applies gravitational force to any children;
    // Force of Sun on planets AND Planets on moons
    this.applyForce = function (f) {
      this.vel.x += f.x / this.mass; //f = mas => f/m
      this.vel.y += f.y / this.mass; //f = mas => f/m
    };

    this.attract = function (child) {
      // calculate distance between planet and sun vectors
      let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
      // calculate newton's universal gravitational Force factor
      let f = this.pos.copy().sub(child.pos);
      f.setMag((G * this.mass * child.mass) / (r * r));
      child.applyForce(f);
    };
  }
}
