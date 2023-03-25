const particles = [];
const particleCount = 200;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);
  particles.forEach((particle) => {
    particle.update();
    particle.display();
    particle.checkEdges();
  });
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0.01); // Simulating the wicking effect with upward force
    this.size = 5;
  }

  update() {
    this.velocity.add(p5.Vector.mult(this.acceleration, timeScale));
    this.position.add(p5.Vector.mult(this.velocity, timeScale));
    this.velocity.limit(3 * timeScale);
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y = -this.velocity.y;
    }
  }
}

let timeScale = 1;

function updateTimeScale() {
  const slider = document.getElementById("timeScale");
  timeScale = parseFloat(slider.value);
}

