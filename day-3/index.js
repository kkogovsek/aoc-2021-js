const fs = require("fs");
const { findBreakingChanges } = require("graphql");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const nums = [];

for (let line in input) {
  if (line === "0") {
    for (let char of input[line].split("")) {
      nums.push(char);
    }
  } else {
    for (let char in input[line]) {
      nums[char] += input[line][char];
    }
  }
}

let gamma = "";
for (let num of nums) {
  if (num.length / 2 < num.replace(/0/g, "").length) {
    gamma += "1";
  } else {
    gamma += "0";
  }
}
let epsilon = "";
for (let num of nums) {
  if (num.length / 2 < num.replace(/0/g, "").length) {
    epsilon += "0";
  } else {
    epsilon += "1";
  }
}
gamma = Number.parseInt(gamma, 2);
epsilon = Number.parseInt(epsilon, 2);

///////////////////////

function mostCommon(num) {
  if (num.length / 2 <= num.replace(/[0]/g, "").length) {
    return "1";
  } else {
    return "0";
  }
}

let numbers = input;
for (let i = 0; i < numbers[0].length; i++) {
  if (numbers.length === 1) break;
  const { 0: zeros, 1: ones } = numbers.reduce(
    (score, num) => {
      score[num[i]] += 1;
      return score;
    },
    { 0: 0, 1: 0 }
  );
  let searchingFor = zeros > ones ? "0" : "1";
  numbers = numbers.filter((num) => num[i] === searchingFor);
}

const oxy = Number.parseInt(numbers[0], 2);

numbers = input;
for (let i = 0; i < numbers[0].length; i++) {
  if (numbers.length === 1) break;
  const { 0: zeros, 1: ones } = numbers.reduce(
    (score, num) => {
      score[num[i]] += 1;
      return score;
    },
    { 0: 0, 1: 0 }
  );
  let searchingFor = zeros <= ones ? "0" : "1";
  numbers = numbers.filter((num) => num[i] === searchingFor);
}
const co2 = Number.parseInt(numbers[0], 2);

console.log(co2 * oxy);
