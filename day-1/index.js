const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const nums = input.map((a) => Number(a));

const groups = nums.reduce((sum, item, index, all) => {
  console.log(sum, index, item, all);
  if (index > all.length - 3) {
    return sum;
  }
  return [...sum, item + all[index + 1] + all[index + 2]];
}, []);

const sum = groups.reduce((count, item, index, all) => {
  if (index === 0) return count;
  if (item > all[index - 1]) return count + 1;
  return count;
}, 0);
console.log(sum);
