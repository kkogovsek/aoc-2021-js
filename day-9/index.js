const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const field = input.map((line) => line.split("").map((a) => Number(a)));

const adjacent = (x, y) => {
  x = Number(x);
  y = Number(y);
  let dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let vals = [];
  for (let [x1, y1] of dirs) {
    const [seekX, seekY] = [x + x1, y + y1];
    if (
      seekY >= 0 &&
      seekY < field.length &&
      seekX >= 0 &&
      seekX < field[0].length
    ) {
      vals.push(field[seekY][seekX]);
    }
  }
  return vals;
};

const lowPoints = [];
for (let y in field) {
  for (let x in field[y]) {
    const adjacents = adjacent(x, y);
    if (
      Math.min(field[y][x], ...adjacents) === field[y][x] &&
      !adjacents.includes(field[y][x])
    ) {
      lowPoints.push([x, y]);
    }
  }
}

/*
const risks = lowPoints
  .map(([x, y]) => field[y][x] + 1)
  .reduce((a, b) => a + b, 0);
console.log(risks);
*/

const basins = lowPoints.map(([x, y]) => {
  let beenThere = [`${x}-${y}`];
  let adjacents = [];

  const adjacentPath = (x, y) => {
    let dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    x = Number(x);
    y = Number(y);
    let vals = [];

    for (let [x1, y1] of dirs) {
      const [seekX, seekY] = [x + x1, y + y1];

      if (
        seekY >= 0 &&
        seekY < field.length &&
        seekX >= 0 &&
        seekX < field[0].length &&
        field[seekY][seekX] !== 9 &&
        field[y][x] < field[seekY][seekX]
      ) {
        if (beenThere.includes[`${seekX}-${seekY}`]) continue;
        beenThere.push(`${seekX}-${seekY}`);

        adjacents.push([seekX, seekY]);
        adjacentPath(seekX, seekY);
      }
    }
  };

  let dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  adjacentPath(x, y);
  const a = [...new Set(adjacents.map(([x, y]) => `${x}-${y}`))];
  return a.length + 1;
});

const threeLargest = (a) => {
  let maxs = [];
  for (let i = 0; i < 3; i++) {
    let largest;
    largest = Math.max(...a);
    maxs.push(largest);
    let index = a.indexOf(largest);
    delete a[index];
    a = a.filter((a) => !isNaN(a));
  }
  return maxs.reduce((a, b) => a * b, 1);
};
console.log(threeLargest(basins));
