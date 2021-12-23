const fs = require("fs");
const memoizee = require("memoizee");
const { join } = require("path");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let template;
let pairs = {};
for (let line of input) {
  if (!template) {
    template = line;
  } else if (line.length === 0) {
  } else {
    let [from, to] = line.split(" -> ");
    pairs[from] = to;
  }
}

let temp = template.split("");
let map = temp.slice(0, temp.length - 1).reduce((all, _, i) => {
  let key = `${temp[i]}${temp[i + 1]}`;
  all[key] = (all[key] ?? 0) + 1;
  return all;
}, {});

for (let line in new Array(40).fill(null)) {
  map = Object.entries(map).reduce((all, [key, count]) => {
    let to = pairs[key];
    let [left, right] = key.split("");
    let [leftFrom, rightFrom] = [`${left}${to}`, `${to}${right}`];
    all[leftFrom] = (all[leftFrom] ?? 0) + count;
    all[rightFrom] = (all[rightFrom] ?? 0) + count;
    return all;
  }, {});
}

let letterMap = Object.entries(map).reduce((all, [key, count]) => {
  const [leftFrom, rightFrom] = key.split("");
  all[leftFrom] = (all[leftFrom] ?? 0) + count;
  all[rightFrom] = (all[rightFrom] ?? 0) + count;
  return all;
}, {});

letterMap = Object.fromEntries(
  Object.entries(letterMap).map(([key, value]) => [key, Math.ceil(value / 2)])
);

console.log(
  Math.max(...Object.values(letterMap)) - Math.min(...Object.values(letterMap))
);
