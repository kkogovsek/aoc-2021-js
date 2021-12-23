const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

let players = [3, 7];
let scores = [0, 0];

let player = 0;

function sum3([a, b, c]) {
  return a + b + c;
}

let count = 0;
let combos = [
  [1, 1, 1],
  [1, 1, 2],
  [1, 1, 3],
  [1, 2, 1],
  [1, 2, 2],
  [1, 2, 3],
  [1, 3, 1],
  [1, 3, 2],
  [1, 3, 3],
  [2, 1, 1],
  [2, 1, 2],
  [2, 1, 3],
  [2, 2, 1],
  [2, 2, 2],
  [2, 2, 3],
  [2, 3, 1],
  [2, 3, 2],
  [2, 3, 3],
  [3, 1, 1],
  [3, 1, 2],
  [3, 1, 3],
  [3, 2, 1],
  [3, 2, 2],
  [3, 2, 3],
  [3, 3, 1],
  [3, 3, 2],
  [3, 3, 3],
];

function movePlayer(pos, player, move) {
  return pos.map((p, i) => (i === player ? (p + move) % 10 : p));
}

function addScore(scores, player, score) {
  return scores.map((s, i) => (i === player ? s + score : s));
}

function sum2([x, y], [xx, yy]) {
  return [x + xx, y + yy];
}

function getItterationKey(player, score, positions) {
  return `${player}|${score.join(",")}|${positions.join(",")}`;
}
let memoMap = new Map();

function wins(player, score = [0, 0], positions) {
  if (score[0] >= 21) return [1, 0];
  else if (score[1] >= 21) return [0, 1];

  let key = getItterationKey(player, score, positions);
  if (memoMap.has(key)) {
    return memoMap.get(key);
  }

  const result = combos.reduce(
    (winCount, combo) => {
      const move = sum3(combo);
      const nextPos = movePlayer(positions, player, move);
      const nextScore = addScore(score, player, nextPos[player] + 1);
      const nextWins = wins((player + 1) % 2, nextScore, nextPos);
      return sum2(winCount, nextWins);
    },
    [0, 0]
  );
  memoMap.set(key, result);
  return result;
}
console.log(Math.max(...wins(0, [0, 0], [9, 2])));
/*
for (let i = 99; true; ) {
  function roll() {
    i = (i + 1) % 100;
    return i;
  }
  let pos = players[player];
  let [a, b, c] = [roll() + 1, roll() + 1, roll() + 1];
  let move = a + b + c;

  let next = (pos + move) % 10;
  players[player] = next;
  scores[player] += next + 1;
  count += 3;

  if (scores[player] >= 1000) {
    console.log(count * Math.min(...scores));
    process.exit(0);
  }

  player = (player + 1) % 2;
}
*/
