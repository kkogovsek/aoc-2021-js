const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let ages = input[0].split(",").map((a) => Number(a));

const memoize = require("memoizee");
const offsprs = memoize(function offs(dni) {
  if (dni < 0) return 0;
  switch (dni) {
    case 9:
    case 8:
      return 3;
    case 7:
    case 6:
    case 5:
    case 4:
    case 3:
    case 2:
    case 1:
      return 2;
    case 0:
      return 0;
    default:
      return offsprs(dni - 9) + offsprs(dni - 7);
  }
});

let days = 256;
let all = 0;
for (let fish of ages) {
  let daysLeft = days - fish;
  all += offsprs(daysLeft);
  console.log(fish, "of", offsprs(daysLeft), "dl", daysLeft);
}

console.log(all);
