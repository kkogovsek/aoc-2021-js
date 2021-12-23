const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const grid = input.map((a) => a.split("").map((a) => Number(a)));

function print() {
  for (let line of grid) {
    console.log(line.join(""));
  }
  console.log();
}

let flashes = 0;
let steps = 1;
const step = () => {
  const flashed = [];
  let flashedYet = false;

  const adjacent = (x, y) => {
    x = Number(x);
    y = Number(y);
    let dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ];
    let vals = [];
    for (let [x1, y1] of dirs) {
      const [seekX, seekY] = [x + x1, y + y1];
      if (
        seekY >= 0 &&
        seekY < grid.length &&
        seekX >= 0 &&
        seekX < grid[0].length
      ) {
        grid[seekY][seekX]++;
      }
    }
  };

  for (let y in grid) {
    for (let x in grid[y]) {
      grid[y][x]++;
    }
  }
  do {
    flashedYet = false;
    for (let y in grid) {
      for (let x in grid[y]) {
        if (grid[y][x] > 9 && !flashed.includes(`${y}-${x}`)) {
          flashes++;
          flashedYet = true;
          flashed.push(`${y}-${x}`);
          adjacent(x, y);
        }
      }
    }
  } while (flashedYet);

  for (let y in grid) {
    for (let x in grid[y]) {
      if (grid[y][x] > 9) {
        grid[y][x] = 0;
      }
    }
  }

  //print();
  if (flashed.length === 100) {
    console.log(steps);
    process.exit(0);
  }
  steps++;
};

// print();
while (true) step();
