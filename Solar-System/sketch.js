let sunMass = 150;
let solarSystem = {};
let stars = [];
const G = 9.8;
let destabilizeFactor = 0.00005;

let modelSpeed = 1;

//ui buttons
const btnWidth = 72;
let backBtn;

//TODO: ADD MOONS AND MOON ORBITS

//todo: add hover on planets
// maybe a small box with planet info
// can update when a mouse enters a planet and dissapears after a set amount of timeSinceHover
// todo: add light year counter / time to complete orbit

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
    // multiply by a tiny random destabilizing factor for a more elliptical orbit
    planetVel.mult(random(1 - destabilizeFactor, 1 + destabilizeFactor));
    return planetVel;
  }

  // set the solar system map,
  solarSystem = {
    sun: {
      body: new Body(
        sunMass,
        createVector(0, 0),
        createVector(0, 0),
        color(255, 230, 102)
      ),
      children: [
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
      ],
    },
    Mercury: {
      body: new Body(
        8,
        getPlanetPos((sunMass * 3) / 5),
        getPlanetVel((sunMass * 3) / 5, sunMass),
        color(176, 176, 176)
      ),
      children: [],
    },
    Venus: {
      body: new Body(
        19,
        getPlanetPos((sunMass * 3) / 4),
        getPlanetVel((-sunMass * 3) / 4, sunMass),
        color(238, 201, 110)
      ),
      children: [],
    },
    Earth: {
      body: new Body(
        20,
        getPlanetPos(sunMass),
        getPlanetVel(sunMass, sunMass),
        color(51, 153, 255)
      ),
      children: [],
    },
    Mars: {
      body: new Body(
        10,
        getPlanetPos(sunMass * 1.5),
        getPlanetVel(sunMass * 1.5, sunMass),
        color(255, 102, 0)
      ),
      children: [],
    },
    Belt: {
      body: new Body(
        3,
        getPlanetPos(sunMass * 1.75),
        getPlanetVel(-sunMass * 1.75, sunMass),
        color(238, 200, 144)
      ),
      children: [],
    },
    Jupiter: {
      body: new Body(
        120,
        getPlanetPos(sunMass * 2.5),
        getPlanetVel(sunMass * 2.5, sunMass),
        color(238, 200, 144)
      ),
      children: [],
    },
    Saturn: {
      body: new Body(
        100,
        getPlanetPos(sunMass * 3.3),
        getPlanetVel(sunMass * 3.3, sunMass),
        color(152, 245, 255)
      ),
      children: [],
    },
    Uranus: {
      body: new Body(
        65,
        getPlanetPos(sunMass * 3.85),
        getPlanetVel(sunMass * 3.85, sunMass),
        color(51, 102, 255)
      ),
      children: [],
    },
    Neptune: {
      body: new Body(
        60,
        getPlanetPos(sunMass * 4.35),
        getPlanetVel(sunMass * 4, sunMass),
        color(229, 229, 229)
      ),
      children: [],
    },
    Pluto: {
      body: new Body(
        5,
        getPlanetPos(sunMass * 5.2),
        getPlanetVel(sunMass * 5, sunMass),
        color(255, 230, 102)
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
  solarSystem["sun"]["body"].glow = 50;

  // populate the stars array with bodies
  for (let i = 0; i < 6 ** 2; i++) {
    // randomize position in the screen
    let positionVec = createVector(
      random(0, width - 10),
      random(0, height - 10)
    );
    let starSize = random(2, 8);
    stars.push(
      new Body(starSize, positionVec, createVector(0, 0), color(255, 255, 255))
    );
  }
}

// Update positions of bodies and draw to the screen
function draw() {
  // draw the bg and the stars on top
  background(19, 15, 64);
  text("FPS: " + floor(frameRate()), width - 70, 40);
  stars.forEach(function (star, idx, array) {
    star.show();
    star.drawStar();
  });

  // move center of solar system to center of screen
  translate(width / 2, height / 2);

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
  }

  // add buttons to canvas
  // back btn
  drawingContext.shadowBlur = 12;
  image(backBtn, -width / 2 + 20, -height / 2 + 20, btnWidth, btnWidth);
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
  constructor(mass, pos, vel, _color) {
    this.mass = mass;
    this.pos = pos;
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
      for (let i = 0; i < this.path.length - 2; i += 2) {
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
      noStroke();
      fill(_color);
      // reset back to glow factor for planet body
      drawingContext.shadowBlur = this.glow;
      drawingContext.shadowColor = _color;
      ellipse(this.pos.x, this.pos.y, this.mass, this.mass);
    };

    // draws just the body onto canvas
    this.draw = function () {};

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
        // set new pos
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
