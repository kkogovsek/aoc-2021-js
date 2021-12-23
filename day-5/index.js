const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const data = input.map((line) => {
  const [left, right] = line.split(" -> ");
  const [x1, y1] = left.split(",");
  const [x2, y2] = right.split(",");
  return [
    [Number(x1), Number(y1)],
    [Number(x2), Number(y2)],
  ];
});

let [maxX, maxY] = data
  .flatMap((a) => a)
  .reduce(
    ([minX, minY], [cX, cY]) => {
      return [cX > minX ? cX : minX, cY > minY ? cY : minY];
    },
    [0, 0]
  );
[maxX, maxY] = [maxX + 1, maxY + 1];

const field = new Array(maxY).fill(null).map(() => new Array(maxX).fill(0));

function order([x1, y1], [x2, y2]) {
  if (x1 > x2) {
    return [
      [x2, y2],
      [x1, y1],
    ];
  } else if (x2 > x1) {
    return [
      [x1, y1],
      [x2, y2],
    ];
  } else if (y1 > y2) {
    return [
      [x2, y2],
      [x1, y1],
    ];
  } else {
    return [
      [x1, y1],
      [x2, y2],
    ];
  }
}

function fill(p1, p2) {
  if (p1[0] === p2[0]) {
    // move Y
    const [start, end] = order(p1, p2);
    for (let i = start[1]; i <= end[1]; i++) {
      field[i][start[0]]++;
    }
  } else if (p1[1] === p2[1]) {
    const [start, end] = order(p1, p2);

    for (let i = start[0]; i <= end[0]; i++) {
      field[start[1]][i]++;
    }
  } else {
    let dirX = p2[0] - p1[0] > 0 ? 1 : -1;
    let dirY = p2[1] - p1[1] > 0 ? 1 : -1;
    for (let i = 0; i <= Math.abs(p1[0] - p2[0]); i++) {
      field[p1[1] + i * dirY][p1[0] + i * dirX]++;
    }
  }
}

data
  // .filter(([p1, p2]) => p1[0] === p2[0] || p1[1] === p2[1])
  .forEach(([p1, p2]) => fill(p1, p2));

/*
console.log(
  0,
  " ",
  new Array(9)
    .fill(0)
    .map((a, i) => i)
    .join("")
);
field.forEach((line, i) =>
  console.log(i, " ", line.join("").replace(/0/g, "."))
);
*/

const res = field
  .flatMap((a) => a)
  .reduce((sum, a) => (a > 1 ? sum + 1 : sum), 0);
console.log(res);
