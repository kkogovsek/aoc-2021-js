const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

function move([x, y, aim], dir, ammount) {
  switch (dir) {
    case "forward":
      return [x + ammount, y + aim * ammount, aim];
    case "up":
      return [x, y, aim - ammount];
    case "down":
      return [x, y, aim + ammount];
  }
}

const [x, y, aim] = input.reduce(
  (pos, mov) => {
    const [dir, amm] = mov.split(" ");
    return move(pos, dir, Number(amm));
  },
  [0, 0, 0]
);
console.log(x * y);
