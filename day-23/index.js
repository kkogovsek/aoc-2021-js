const { count } = require("console");
const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const MOVE_BASE = "MOVE_BASE";
const MOVE_CORR = "MOVE_CORR";

const numMap = { A: 0, B: 1, C: 2, D: 3 };
const revMap = { 0: "A", 1: "B", 2: "C", 3: "D" };
/*
const bases = [
  ["B", "D", "D", "A"],
  ["C", "C", "B", "D"],
  ["B", "B", "A", "C"],
  ["D", "A", "C", "A"],
].map((a) => a.map((b) => numMap[b]));
*/
const bases = [
  ["C", "D", "D", "B"],
  ["B", "C", "B", "C"],
  ["D", "B", "A", "A"],
  ["D", "A", "C", "A"],
].map((a) => a.map((b) => numMap[b]));

const corr = new Array(11).fill(null);
const operation = {
  type: MOVE_BASE,
  base: 0,
};

function moveCost(number, el) {
  return number * Math.pow(10, el);
}

function isCorridorFree(corr, from, to) {
  let free = true;
  for (let i = from; i !== to; ) {
    i += Math.sign(to - from);
    free = free && corr[i] === null;
  }
  return free;
}

function isBaseAccepting(base, baseId) {
  return base.every((el) => el === null || el === baseId);
}

function getBaseCandidate(base, baseId) {
  let correct = 0;
  for (let el in base) {
    el = Number(el);
    if (base[el] === baseId) correct++;
    if (
      (base[el] !== baseId || base.slice(el + 1).some((el) => el !== baseId)) &&
      base[el] !== null
    ) {
      return {
        candidate: base[el],
        cost: moveCost(Number(el) + 1, base[el]),
        position: baseId * 2 + 2,
        newBase: base.map((a, i) => (i == el ? null : a)),
      };
    }
  }
  if (count == 4) return true; // Base FULL
  return false; // Base needs change
}

function print(bases, corr) {
  console.log("#############");
  console.log(`#${corr.map((a) => (a === null ? "." : a)).join("")}#`);
  console.log(
    `###${bases.map((base, i) => revMap[base[0]] ?? ".").join("#")}###`
  );
  console.log(
    `  #${bases.map((base, i) => revMap[base[1]] ?? ".").join("#")}#`
  );
  console.log(
    `  #${bases.map((base, i) => revMap[base[2]] ?? ".").join("#")}#`
  );
  console.log(
    `  #${bases.map((base, i) => revMap[base[3]] ?? ".").join("#")}#`
  );
  console.log("  #########");
}

function baseToPos(base) {
  return (base + 1) * 2;
}

function moveToBase(base, el) {
  if (base[3] === null)
    return { nextBase: [null, null, null, el], cost: moveCost(4, el) };
  if (base[2] === null)
    return { nextBase: [null, null, el, base[3]], cost: moveCost(3, el) };
  if (base[1] === null)
    return { nextBase: [null, el, base[2], base[3]], cost: moveCost(2, el) };
  if (base[0] === null)
    return { nextBase: [el, base[1]], cost: moveCost(1, el) };
  throw new Error(`Yo can't do this`);
}

let globalMinima = Infinity;
function step(bases, corr, gas = 0) {
  if (gas > globalMinima) {
    return Infinity;
  }
  if (bases.every((base, id) => base.every((el) => el === id))) {
    // console.log("Got one!!!!!", gas);
    return 0;
  }

  let minCost = Infinity;
  function setMin(cost) {
    minCost = Math.min(minCost, cost);
    globalMinima = Math.min(globalMinima, cost);
  }
  for (let corrId in corr) {
    corrId = Number(corrId);
    const el = corr[corrId];
    if (el !== null) {
      const targetPos = baseToPos(el);
      if (isCorridorFree(corr, corrId, targetPos)) {
        if (isBaseAccepting(bases[el], el)) {
          const { nextBase, cost: parkingCost } = moveToBase(bases[el], el);
          const nextCost = step(
            bases.map((base, i) => (i === el ? nextBase : base)),
            corr.map((el, i) => (i === corrId ? null : el)),
            gas + parkingCost + moveCost(Math.abs(corrId - targetPos), el)
          );
          setMin(
            gas +
              nextCost +
              parkingCost +
              moveCost(Math.abs(corrId - targetPos), el)
          );
        }
      }
    }
  }

  for (let baseId in bases) {
    let skipOthers = false;
    baseId = Number(baseId);
    let base = bases[baseId];
    const candidate = getBaseCandidate(base, baseId);
    if (candidate === true) {
    } else if (candidate) {
      const { cost, position, newBase, candidate: targetBase } = candidate;
      const targetPosition = targetBase * 2 + 2;

      if (isCorridorFree(corr, position, targetPosition)) {
        if (isBaseAccepting(bases[targetBase], targetBase)) {
          skipOthers = true;
          const { nextBase, cost: parkingCost } = moveToBase(
            bases[targetBase],
            targetBase
          );
          const nextCost = step(
            bases.map((b, i) => {
              if (i === baseId) {
                return newBase;
              }
              if (i === targetBase) {
                return nextBase;
              }
              return b;
            }),
            corr,
            gas +
              parkingCost +
              moveCost(Math.abs(position - targetPosition), targetBase) +
              cost
          );
          setMin(
            cost +
              parkingCost +
              nextCost +
              moveCost(Math.abs(position - targetPosition), targetBase) +
              gas
          );
        }
      }
      if (!skipOthers) {
        for (let i = 0; i < corr.length; i++) {
          if ((i - 2) % 2 === 0 && !(i < 2 || i > 9)) {
            continue;
          }
          if (isCorridorFree(corr, position, i)) {
            // can move
            const costToI = moveCost(Math.abs(i - position), targetBase);
            const nextMinimal = step(
              bases.map((b, i) => (i === baseId ? newBase : b)),
              corr.map((el, idx) => (i === idx ? targetBase : el)),
              gas + cost + costToI
            );
            setMin(cost + costToI + nextMinimal + gas);
          }
        }

        // target to end
        // position to other end
      }
    }
  }

  return minCost;
}

step(bases, corr);
console.log(globalMinima);
