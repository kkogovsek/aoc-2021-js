const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let [drawn, ...boards] = input;

drawn = drawn.split(",").map((a) => Number(a));

const all = Symbol.for("all");
const column = Symbol.for("column");

let players = [];
let a, b, c, d, e;
let winners = [];
while (boards.length > 0) {
  [, a, b, c, d, e, ...boards] = boards;
  players.push(
    [a, b, c, d, e]
      .map((line) => line.trim())
      .map((line) => line.split(/\s+/g).map((a) => Number(a)))
      .map((line) =>
        line.reduce((map, num) => ({ ...map, [num]: false }), { [all]: line })
      )
  );
}

players = players.map((player) => {
  let columns = [[], [], [], [], []];
  player.forEach((line) =>
    line[all].forEach((number, column) => columns[column].push(number))
  );
  console.log(columns);
  player.push(
    ...columns.map((line) =>
      line.reduce((map, num) => ({ ...map, [num]: false }), {
        [all]: line,
        [column]: true,
      })
    )
  );
  return player;
});

console.log(players);

for (let number of drawn) {
  for (let player of players) {
    let won = false;
    for (let lineNum in player) {
      if (player[lineNum][all].includes(number)) {
        player[lineNum][number] = true;
      }
      won = won || Object.entries(player[lineNum]).every(([, bool]) => bool);
    }
    if (won && !winners.includes(player)) {
      winners.push(player);
      console.log("won", players.indexOf(player) + 1);
    }
    if (won && winners.length === players.length) {
      const unmatched = player.flatMap((line) =>
        Object.entries(line)
          .filter(([, bool]) => !bool)
          .map(([num]) => Number(num))
      );
      const sum = unmatched.reduce((a, b) => a + b, 0);
      console.log(sum, number, (sum / 2) * number);
      process.exit(0);
    }
  }
}

/*
 3 15     22
 18    
19  8   25 
20     
   12  6

*/
