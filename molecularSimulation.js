let grid;
let gridSize = 100;
let hydrophilicChance = 0.2;
let timeScale = 1;
let frameCounter = 0;

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent("simulation");
  grid = new Grid(gridSize);
}

function draw() {
  background(220);
  grid.display();
  grid.update();
}

function updateTimeScale() {
  const slider = document.getElementById("timeScale");
  timeScale = parseFloat(slider.value) / 100;
}

class Grid {
  constructor(size) {
    this.size = size;
    this.cellSize = width / size;
    this.cells = new Array(size * size).fill(0).map((_, i) => {
      if (i < size * (size - 1) && random() < hydrophilicChance) return 2; // Hydrophilic cells
      if (i > size * (size - 1) && random() < 0.2) return 1; // Water particles
      return 0; // Empty cells
    });
  }

  update() {
    frameCounter++;
    if (frameCounter >= Math.round(1 / timeScale)) {
      frameCounter = 0;
      for (let i=this.cells.length; i>= this.size;  i--) {
        if (this.cells[i] === 1) {
          let above = i - this.size;
          let left = i - 1;
          let right = i + 1;
          let canMoveUp = this.cells[above] === 0 || (this.cells[above] === 2 && this.cells[left] !== 2 && this.cells[right] !== 2);

          if (canMoveUp) {
            this.cells[i] = 0;
            this.cells[above] = 1;
          } else if (this.cells[left] === 0) {
            this.cells[i] = 0;
            this.cells[left] = 1;
          } else if (this.cells[right] === 0) {
            this.cells[i] = 0;
            this.cells[right] = 1;
          }
        }
      }
    }
  }

  display() {
    for (let i = 0; i < this.cells.length; i++) {
      let x = (i % this.size) * this.cellSize;
      let y = floor(i / this.size) * this.cellSize;
      fill(this.cells[i] === 1 ? "blue" : this.cells[i] === 2 ? "green" : "white");
      rect(x, y, this.cellSize, this.cellSize);
    }
  }
}
