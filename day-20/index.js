const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const DEFAULT = Symbol.for("some random default");
let algo = null;
let imageSrc = [];

for (let line of input) {
  if (line) {
    if (!algo) {
      algo = line.split("").map((a) => (a === "#" ? 1 : 0));
    } else {
      imageSrc.push(line.split("").map((a) => (a === "#" ? 1 : 0)));
    }
  }
}

function key([x, y]) {
  return `${x},${y}`;
}

function getBinarySurrounding([x, y], image) {
  let bin = "";
  for (let yy = y - 1; yy <= y + 1; yy++)
    for (let xx = x - 1; xx <= x + 1; xx++) {
      if (image.hasOwnProperty(key([xx, yy])))
        bin += image[key([xx, yy])] ? "1" : "0";
      else bin += image[DEFAULT] ? "1" : "0";
    }
  return parseInt(bin, 2);
}

let image = {};
for (let y in imageSrc) {
  for (let x in imageSrc[y]) {
    image[
      key([
        // x - Math.floor(imageSrc[x].length / 2),
        // y - Math.floor(imageSrc.length / 2),
        x,
        y,
      ])
    ] = imageSrc[y][x];
  }
}

function print(image) {
  const pixels = Object.keys(image).map((key) =>
    key.split(",").map((a) => Number(a))
  );
  const [minX, maxX] = [
    Math.min(...pixels.map((a) => a[0])),
    Math.max(...pixels.map((a) => a[0])),
  ];
  const [minY, maxY] = [
    Math.min(...pixels.map((a) => a[1])),
    Math.max(...pixels.map((a) => a[1])),
  ];

  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      line += image[key([x, y])] ? "#" : ".";
    }
    console.log(line);
  }
  console.log();
}

function step(image) {
  const pixels = Object.keys(image).map((key) =>
    key.split(",").map((a) => Number(a))
  );
  const [minX, maxX] = [
    Math.min(...pixels.map((a) => a[0])),
    Math.max(...pixels.map((a) => a[0])),
  ];
  const [minY, maxY] = [
    Math.min(...pixels.map((a) => a[1])),
    Math.max(...pixels.map((a) => a[1])),
  ];

  let nextImage = {};
  for (let y = minY - 1; y <= maxY + 1; y++) {
    let line = "";
    for (let x = minX - 1; x <= maxX + 1; x++) {
      nextImage[key([x, y])] = algo[getBinarySurrounding([x, y], image)];
    }
  }

  // print(nextImage);
  return Object.assign(nextImage, {
    [DEFAULT]: image[DEFAULT] ? algo[algo.length - 1] : algo[0],
  });
}

image = Object.assign(image, { [DEFAULT]: 0 });
// print(image);
for (let i = 0; i < 50; i++) image = step(image);

console.log(Object.values(image).reduce((a, b) => a + b, 0));
