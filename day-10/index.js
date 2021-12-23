const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const cost = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};
const closing = {
  "(": ")",
  "{": "}",
  "[": "]",
  "<": ">",
};

let scores = [];
for (let line of input) {
  let parenthesis = [];
  let score = 0;
  for (let sign of line.split("")) {
    if (closing[sign]) {
      parenthesis.push(sign);
    } else {
      if (closing[parenthesis[parenthesis.length - 1]] === sign) {
        parenthesis.pop();
        continue;
      }
      score += cost[sign];
      break;
    }
  }
  if (score > 0) continue;
  const a = parenthesis.reverse().map((a) => closing[a]);
  let res = 0;
  for (let b of a) {
    res = res * 5 + cost[b];
  }
  scores.push(res);
}
console.log(scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]);
