const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let fieldBase = input.map((line) => line.split("").map((a) => Number(a)));

let field = new Array(fieldBase.length * 5).fill(null).map(() => []);
for (let yk = 0; yk < 5; yk++) {
  for (let xk = 0; xk < 5; xk++) {
    for (let y in fieldBase) {
      for (let x in fieldBase) {
        y = Number(y);
        x = Number(x);

        let [destX, destY] = [
          xk * fieldBase[0].length + x,
          yk * fieldBase.length + y,
        ];
        let val = fieldBase[y][x];
        val += yk + xk;
        if (val > 9) val = val % 9;
        field[destY][destX] = val;
      }
    }
  }
}

function canMove([x, y]) {
  return x <= field[0].length - 1 && y <= field.length - 1 && x >= 0 && y >= 0;
}

function add([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

function getKey([x, y]) {
  return `${x}-${y}`;
}

const { min } = require("lodash");

function risk([x, y] = [0, 0], visited = []) {
  if (x === field[0].length - 1 && y === field.length - 1) {
    return field[y][x];
  }
  const pos = [x, y];
  let moves = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const q = {};

  for (let y in field) {
    for (let x in field) {
      y = Number(y);
      x = Number(x);
      q[getKey([x, y])] = {
        key: getKey([x, y]),
        dist: Infinity,
        prev: null,
        pos: [x, y],
        cost: field[y][x],
      };
    }
  }
  q["0-0"].dist = 0;
  const bkp = { ...q };

  const mins = {
    "0-0": 0,
  };

  let count = Object.keys(q).length;
  while (count > 0) {
    if (count % 1000 === 0)
      console.log(
        Math.round((Object.keys(q).length / Object.keys(bkp).length) * 100),
        "%",
        count
      );
    const uDist = min(Object.values(mins));
    const uKey = Object.entries(mins).find(([, val]) => val === uDist)[0];
    const u = q[uKey];
    delete q[u.key];
    delete mins[u.key];
    count--;

    moves
      .filter(
        (move) => canMove(add(u.pos, move)) && q[getKey(add(u.pos, move))]
      )
      .forEach((move) => {
        let nextPos = add(u.pos, move);
        const nextKey = getKey(nextPos);
        const next = q[nextKey];
        const alt = u.dist + next.cost;
        if (next.dist > alt) {
          mins[nextKey] = alt;
          next.dist = alt;
          next.prev = u.key;
        }
      });
  }
  return bkp[getKey([field[0].length - 1, field.length - 1])];
}

console.log(risk());

/*
function risk([x, y] = [0, 0], visited = []) {
  if (x === field[0].length - 1 && y === field.length - 1) {
    return field[y][x];
  }
  const pos = [x, y];
  let moves = [
    [1, 0],
    [0, 1],
  ];
  return Math.min(
    ...moves
      .filter((move) => canMove(add(pos, move), visited))
      .map((move) => {
        let next = add(pos, move);
        return field[y][x] + memoRisk(next, visited.concat(`${x}-${y}`));
      })
  );
};

console.log(memoRisk() - field[0][0]);

*/
