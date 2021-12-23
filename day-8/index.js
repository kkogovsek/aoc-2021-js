const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const map = {
  0: "abcefg",
  1: "cf",
  2: "acdeg",
  3: "acdfg",
  4: "bcdf",
  5: "abdfg",
  6: "abdefg",
  7: "acf",
  8: "abcdefg",
  9: "abcdfg",
};
revMap = Object.fromEntries(Object.entries(map).map(([a, b]) => [b, a]));
const lengths = {
  2: [map[1]],
  3: [map[7]],
  4: [map[4]],
  5: [map[2], map[3], map[5]],
  6: [map[0], map[6], map[9]],
  7: [map[8]],
};

const order = (a) => a.split("").sort().join("");

let sum = 0;
for (let line of input) {
  const [left, right] = line.split("|").map((a) =>
    a
      .trim()
      .split(" ")
      .map((a) => order(a))
  );

  const all = left;

  let pass = all.map((s) => ({ sequence: s, decoded: null }));
  // simple
  pass = pass.map((p) => {
    if (lengths[p.sequence.length].length === 1) {
      const dec = lengths[p.sequence.length][0];
      return { ...p, decoded: revMap[dec] };
    }
    return p;
  });

  const one = all.find((a) => a.length === 2);
  const four = all.find((a) => a.length === 4);

  // three
  pass = pass.map((p) => {
    if (
      !p.decoded &&
      p.sequence.length === 5 &&
      one.split("").every((e) => p.sequence.split("").includes(e))
    ) {
      return { ...p, decoded: "3" };
    }
    return p;
  });
  // six
  pass = pass.map((p) => {
    if (
      !p.decoded &&
      p.sequence.length === 6 &&
      !one.split("").every((e) => p.sequence.split("").includes(e))
    ) {
      return { ...p, decoded: "6" };
    }
    return p;
  });
  // nine
  pass = pass.map((p) => {
    if (
      !p.decoded &&
      p.sequence.length === 6 &&
      four.split("").every((e) => p.sequence.split("").includes(e))
    ) {
      return { ...p, decoded: "9" };
    }
    return p;
  });
  const nine = pass.find((a) => a.decoded === "9").sequence;
  // zero
  pass = pass.map((p) => {
    if (!p.decoded && p.sequence.length === 6) {
      return { ...p, decoded: "0" };
    }
    return p;
  });
  // Two / five?
  pass = pass.map((p) => {
    if (!p.decoded) {
      if (p.sequence.split("").every((a) => nine.split("").includes(a))) {
        return { ...p, decoded: "5" };
      }
      return { ...p, decoded: "2" };
    }
    return p;
  });

  sum += Number(
    right
      .map((digit) => {
        return pass.find((p) => p.sequence === digit).decoded;
      })
      .join("")
  );
}

console.log(sum);
