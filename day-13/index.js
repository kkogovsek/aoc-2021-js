const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let dots = [];
for (let line of input) {
  if (line.length === 0) break;
  let [x, y] = line.split(",");
  dots.push([Number(x), Number(y)]);
}

let folds = [];
for (let line of input) {
  if (line.startsWith("fold along")) {
    let [axis, pos] = line.replace("fold along ", "").split("=");
    folds.push([axis, Number(pos)]);
  }
}

function correct() {
  const [minX, minY] = [
    Math.min(...dots.map((a) => a[0])),
    Math.min(...dots.map((a) => a[1])),
  ];
  if (minX < 0 || minY < 0) console.log(minX, minY);
}

function print() {
  const [maxX, maxY] = [
    Math.max(...dots.map((a) => a[0])),
    Math.max(...dots.map((a) => a[1])),
  ];
  const arr = new Array(maxY + 1)
    .fill(null)
    .map(() => new Array(maxX + 1).fill(null).map(() => "."));
  for (let [x, y] of dots) {
    arr[y][x] = "#";
  }
  for (let line of arr) {
    console.log(line.join(""));
  }
  console.log();
}

print();
for (let [axis, pos] of folds) {
  let nextDots = [];
  for (let pointIndex in dots) {
    let [x, y] = dots[pointIndex];
    if (axis === "x") {
      if (x > pos) {
        nextDots.push([pos - (x - pos), y]);
      } else {
        nextDots.push([x, y]);
      }
    } else {
      if (y > pos) {
        nextDots.push([x, pos - (y - pos)]);
      } else {
        nextDots.push([x, y]);
      }
    }
  }
  dots = nextDots;
  correct();
  print();
}

console.log([...new Set(dots.map(([x, y]) => `${x}-${y}`))].length);
