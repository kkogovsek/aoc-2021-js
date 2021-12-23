const fs = require("fs");
const { urlToHttpOptions } = require("http");
const path = require("path");
const { start } = require("repl");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const instructions = input.map((line) => {
  const [_, on, ...other] =
    /(on|off) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)/.exec(
      line
    );
  const [fromX, toX, fromY, toY, fromZ, toZ] = other.map((a) => Number(a));
  const distances = [
    Math.abs(toX - fromX) / 2,
    Math.abs(toY - fromY) / 2,
    Math.abs(toZ - fromZ) / 2,
  ];
  return {
    on: on === "on",
    off: on === "off",
    fromX,
    toX,
    fromY,
    toY,
    fromZ,
    toZ,
    x: [fromX, toX],
    y: [fromY, toY],
    z: [fromZ, toZ],
    distances,
    center: [fromX + distances[0], fromY + distances[1], fromZ + distances[2]],
  };
});

let map = new Map();

function key3d([x, y, z]) {
  return `${x},${y},${z}`;
}

function instructionsCollide(inst1, inst2) {
  let colide = true;
  // for axis
  for (let i = 0; i < 3; i++) {
    colide =
      colide &&
      Math.abs(inst1.center[i] - inst2.center[i]) <=
        inst1.distances[i] + inst2.distances[i];
  }
  return colide;
}

function lines([a1, a2], [b1, b2]) {
  if (a1 < b1 && b2 < a2) {
    return [
      [a1, b1 - 1],
      [b1, b2],
      [b2 + 1, a2],
    ];
  }
  if (a1 <= b2 && b2 < a2) {
    return [
      [a1, b2],
      [b2 + 1, a2],
    ];
  }
  if (a1 < b1 && a2 <= b2) {
    return [
      [a1, b1 - 1],
      [b1, a2],
    ];
  }
  return [[a1, a2]];
}

function gen(inst, x, y, z) {
  const [fromX, toX] = x;
  const [fromY, toY] = y;
  const [fromZ, toZ] = z;

  const distances = [
    Math.abs(toX - fromX) / 2,
    Math.abs(toY - fromY) / 2,
    Math.abs(toZ - fromZ) / 2,
  ];
  return {
    on: inst.on,
    off: inst.off,
    fromX,
    toX,
    fromY,
    toY,
    fromZ,
    toZ,
    x: [fromX, toX],
    y: [fromY, toY],
    z: [fromZ, toZ],
    distances,
    center: [fromX + distances[0], fromY + distances[1], fromZ + distances[2]],
  };
}

function without(inst1, inst2) {
  const x = lines(inst1.x, inst2.x);
  const y = lines(inst1.y, inst2.y);
  const z = lines(inst1.z, inst2.z);

  return x
    .flatMap((xx) =>
      y.flatMap((yy) =>
        z.map((zz) => {
          const tempInst = gen(inst1, xx, yy, zz);
          if (instructionsCollide(tempInst, inst2)) {
            return null;
          }
          return tempInst;
        })
      )
    )
    .filter((a) => a);
}

function lights(instruction) {
  return (
    (instruction.toX - instruction.fromX + 1) *
    (instruction.toY - instruction.fromY + 1) *
    (instruction.toZ - instruction.fromZ + 1)
  );
}

const onAreas = instructions.slice(1).reduce(
  (areas, inst) => {
    const newInstrucitons = areas.flatMap((area) =>
      instructionsCollide(area, inst) ? without(area, inst) : [area]
    );
    if (inst.on) return newInstrucitons.concat(inst);
    return newInstrucitons;
  },
  [instructions[0]]
);

const count = onAreas.reduce((sum, inst) => sum + lights(inst), 0);
console.log(count);
