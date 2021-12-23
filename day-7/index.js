const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const positions = input[0].split(",").map((a) => Number(a));

const memo = require("memoizee");
const getCost = memo(function getCost(mean) {
  return positions.reduce((total, curr) => {
    const n = Math.abs(mean - curr);
    return total + (n * (n + 1)) / 2;
  }, 0);
});

const max = Math.max(...positions);
const min = Math.min(...positions);

function bisect(min, max) {
  if (min === max) return min;
  if (getCost(min) < getCost(max)) {
    return bisect(min, max - Math.round((max - min) / 2));
  } else {
    return bisect(max - Math.round((max - min) / 2), max);
  }
}
const mid = bisect(min, max);
console.log(getCost(mid));
