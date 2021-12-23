const fs = require("fs");
const { parse } = require("path");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const man = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
};

let [packet] = input;
let binPacket = packet
  .split("")
  .map((a) => parseInt(a, 16))
  .map((a) => a.toString(2).padStart(4, "0"));
//  .join("");

binPacket = binPacket.join("");

let cursor = 0;

// parse
function parseNextPacket() {
  let version = parseInt(binPacket.slice(cursor, cursor + 3), 2);
  cursor += 3;
  let type = parseInt(binPacket.slice(cursor, cursor + 3), 2);
  cursor += 3;

  if (type === 4) {
    let number = "";

    let notLast;
    do {
      notLast = parseInt(binPacket.slice(cursor, cursor + 1), 2);
      cursor += 1;
      let nr = binPacket.slice(cursor, cursor + 4);
      cursor += 4;
      number += nr;
    } while (notLast === 1);

    return {
      type: "literal",
      number: parseInt(number, 2),
      version,
      operator: type,
    };
  } else {
    let lengthType = parseInt(binPacket.slice(cursor, cursor + 1), 2);
    cursor += 1;

    if (lengthType === 0) {
      let subpacketsLength = parseInt(binPacket.slice(cursor, cursor + 15), 2);
      cursor += 15;
      let startCursor = cursor;

      let subpackets = [];
      while (cursor < startCursor + subpacketsLength) {
        subpackets.push(parseNextPacket());
      }
      return {
        type: "operator",
        operator: type,
        subpackets,
        version,
      };
    } else {
      let numberOfSubpackets = parseInt(
        binPacket.slice(cursor, cursor + 11),
        2
      );
      cursor += 11;

      let subpackets = [];
      for (let i = 0; i < numberOfSubpackets; i++) {
        subpackets.push(parseNextPacket());
      }
      return {
        type: "operator",
        operator: type,
        subpackets,
        version,
      };
    }
  }
}

const sumVersions = (packet) =>
  packet.version +
  (packet.subpackets?.reduce((sum, p) => sum + sumVersions(p), 0) ?? 0);

const getValue = (packet) => {
  let left, right;
  switch (packet.operator) {
    case 4:
      return packet.number;
    case 0:
      return packet.subpackets.reduce((sum, p) => sum + getValue(p), 0);
    case 1:
      return packet.subpackets.reduce((sum, p) => sum * getValue(p), 1);
    case 2:
      return Math.min(...packet.subpackets.map((p) => getValue(p)));

    case 3:
      return Math.max(...packet.subpackets.map((p) => getValue(p)));
    case 5:
      [left, right] = packet.subpackets;
      return getValue(left) > getValue(right) ? 1 : 0;
    case 6:
      [left, right] = packet.subpackets;
      return getValue(left) < getValue(right) ? 1 : 0;
    case 7:
      [left, right] = packet.subpackets;
      return getValue(left) === getValue(right) ? 1 : 0;
    default:
      throw new Error(`Not operator ${packet.operator}`);
  }
};

const payload = parseNextPacket();
console.log(payload);
console.log(getValue(payload));
