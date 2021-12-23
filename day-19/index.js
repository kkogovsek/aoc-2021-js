const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let scanners = [];
const SCANNER = Symbol.for("scanner");
const FOUND_FROM = Symbol.for("found");
const index = ([x, y, z]) => `${x},${y},${z}`;

const intersection = (a, b) => {
  return [...b].filter((el) => a.has(el));
};

function add([x, y, z], [xx, yy, zz]) {
  return [x + xx, y + yy, z + zz];
}

function diff([x, y, z], [xx, yy, zz]) {
  return [x - xx, y - yy, z - zz];
  // return [-x + xx, -y + yy, -z + zz];
}
let currentScanner = null;
for (let line of input) {
  if (/scanner (\d+)/g.test(line)) {
    [, currentScanner] = /scanner (\d+)/g.exec(line);
    if (!scanners[currentScanner]) scanners[currentScanner] = [];
  } else if (!line) {
    continue;
  } else {
    scanners[currentScanner].push(line.split(",").map((a) => Number(a)));
  }
}

function rotate90([x, y, z], axis) {
  if (axis === 0) return [x, -z, y];
  if (axis === 1) return [-z, y, x];
  if (axis === 2) return [-y, x, z];
}

function mul([x, y, z], [xx, yy, zz]) {
  return [x * xx, y * yy, z * zz];
}

let variants = scanners.map((scanner) => {
  let all = [];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++) {
        let base = scanner;
        for (let c = 0; c < i; c++) {
          base = base.map((b) => rotate90(b, 0));
        }
        for (let c = 0; c < j; c++) {
          base = base.map((b) => rotate90(b, 1));
        }
        for (let c = 0; c < k; c++) {
          base = base.map((b) => rotate90(b, 2));
        }
        all.push(base);
      }

  const reduced = new Set(all.map((a) => a.map((b) => b.join(",")).join("|")));
  return [...reduced].map((a) =>
    a.split("|").map((b) => b.split(",").map((c) => Number(c)))
  );
});
variants = [...variants];

let [start] = scanners;

let found = new Array(scanners.length).fill(null);
found[0] = {
  formation: start,
  relative: start,
  offset: [0, 0, 0],
  index: new Set(start.map((s) => index(s))),
  [SCANNER]: 0,
};
let map = new Map();
map.a;
delete variants[0];

const tried = new Set();

while (variants.filter(Boolean).length > 0) {
  function findMatch() {
    for (let s in variants) {
      let scanner = variants[s];
      for (let v in scanner) {
        let variant = scanner[v];
        for (let fixedScanner of found) {
          if (
            fixedScanner &&
            !tried.has(`${fixedScanner[SCANNER]}|${Number(s)}|${v}`)
          ) {
            tried.add(`${fixedScanner[SCANNER]}|${Number(s)}|${v}`);
            const maybeMatch = match(
              fixedScanner.relative,
              variant,
              fixedScanner.index
            );
            if (maybeMatch) {
              return Object.assign(maybeMatch, {
                [SCANNER]: Number(s),
                [FOUND_FROM]: fixedScanner[SCANNER],
              });
            }
          }
        }
      }
    }
  }
  const matchedScanner = findMatch();

  if (matchedScanner) {
    delete variants[matchedScanner[SCANNER]];
    found[matchedScanner[SCANNER]] = matchedScanner;
    console.log("Only", variants.filter(Boolean).length, "left");
  } else {
    console.log("Huston, we have a problem");
    process.exit(0);
  }
}

console.log("We got it");

const allPoints = found.flatMap((found) => found.relative.map((r) => index(r)));
console.log(new Set(allPoints).size);

const manhattan = ([x, y, z], [xx, yy, zz]) =>
  Math.abs(x - xx) + Math.abs(y - yy) + Math.abs(z - zz);

console.log(
  Math.max(
    ...found.flatMap((a) => found.map((b) => manhattan(a.offset, b.offset)))
  )
);

function match(
  shape1,
  shape2,
  baseIndex = new Set(shape1.map((s) => index(s)))
) {
  let seen = new Set();
  for (let pos1 of shape1) {
    for (let pos2 of shape2) {
      const delta = diff(pos1, pos2);
      if (seen.has(index(delta))) continue;
      seen.add(index(delta));
      const relative = shape2.map((p) => add(p, delta));
      const idx = new Set(relative.map((i) => index(i)));
      const common = intersection(idx, baseIndex);
      if (common.length >= 12) {
        return {
          formation: shape2,
          relative,
          offset: delta,
          index: idx,
        };
      }
    }
  }
  return false;
}

setInterval(() => null, 1000);
