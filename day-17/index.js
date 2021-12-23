const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const [minX, maxX] = [257, 286];
const [minY, maxY] = [-57, -101];

// const [minX, maxX] = [20, 30];
// const [minY, maxY] = [-5, -10];

function calc([velX, velY]) {
  let [posX, posY] = [0, 0];
  // let [velX, velY] = [6, 9];

  function step() {
    posX += velX;
    posY += velY;

    velX -= Math.sign(velX);
    velY -= 1;
  }

  function inBounds([x, y]) {
    return x <= maxX && y >= maxY;
  }

  function reachedTarget([x, y]) {
    return x >= minX && x <= maxX && y <= minY && y >= maxY;
  }

  let highestY = -Infinity;
  while (inBounds([posX, posY]) && !reachedTarget([posX, posY])) {
    step();
    if (posY > highestY) highestY = posY;
  }

  return reachedTarget([posX, posY]) ? `${velX},${velY}` : null;
}

// let high = -Infinity;
let trajectories = new Set();
for (let x = 0; x <= maxX * 2; x++) {
  for (let y = maxY; y < 10000; y++) {
    let res = calc([x, y]);
    if (res) trajectories.add(`${x},${y}`);
  }
}
console.log(trajectories.size);
