const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const data = input.map((a) => eval(a));

const carryLeft = Symbol.for("left");
const carryRight = Symbol.for("right");

function reduce(line) {
  let exploded = false;
  let splitted = true;
  // console.log("source", JSON.stringify(line));
  let count = 0;
  while ((splitted || exploded) && true) {
    exploded = false;
    splitted = false;
    function deepest(arr) {
      return (
        Math.max(
          ...arr.map((el) => {
            if (Array.isArray(el)) return deepest(el);
            return 0;
          })
        ) + 1
      );
    }

    function addLeftmost(arr, num) {
      if (Array.isArray(arr)) {
        let [left, right] = arr;
        return [addLeftmost(left, num), right];
      } else {
        return arr + num;
      }
    }

    function addRightmost(arr, num) {
      if (Array.isArray(arr)) {
        let [left, right] = arr;
        return [left, addRightmost(right, num)];
      } else {
        return arr + num;
      }
    }

    function explode(arr, depth, targetDepth) {
      for (let el in arr) {
        el = Number(el);
        if (Array.isArray(arr[el])) {
          const explosion = explode(arr[el], depth + 1, targetDepth);
          if (explosion) {
            exploded = true;
            // console.log("explosion");
            // console.log("object", explosion);
            // console.log("i=>arr", el, JSON.stringify(arr));
            // console.log();
          }
          if (explosion.toString() === "explode") {
            let addedLeft, addedRight;
            let newArr = arr
              .map((num, i) => {
                if (i === el - 1) {
                  addedLeft = true;
                  return addRightmost(num, explosion[carryLeft]);
                } else if (i === el + 1) {
                  addedRight = true;
                  return addLeftmost(num, explosion[carryRight]);
                } else if (i === el) return 0;
                else return num;
              })
              .filter((a) => a !== null);
            // console.log("first fold", JSON.stringify(newArr));
            // console.log();
            return Object.assign(
              newArr.length > 0 ? newArr : "explode",
              addedLeft ? {} : { [carryLeft]: explosion[carryLeft] },
              addedRight ? {} : { [carryRight]: explosion[carryRight] }
            );
          } else if (explosion) {
            let addedLeft, addedRight;
            let newArr = arr.map((num, i) => {
              if (i === el - 1 && explosion[carryLeft]) {
                addedLeft = true;
                return addRightmost(num, explosion[carryLeft]);
              } else if (i === el + 1 && explosion[carryRight]) {
                addedRight = true;
                return addLeftmost(num, explosion[carryRight]);
              } else if (el === i)
                return Array.isArray(explosion)
                  ? [...explosion]
                  : Number(explosion);
              else return num;
            });
            // console.log("subsequent fold", JSON.stringify(newArr));
            // console.log();
            return Object.assign(
              newArr,
              addedLeft ? {} : { [carryLeft]: explosion[carryLeft] },
              addedRight ? {} : { [carryRight]: explosion[carryRight] }
            );
          }
        }
      }
      return depth >= 5 && depth === targetDepth
        ? Object.assign(0, {
            [carryLeft]: arr[0],
            [carryRight]: arr[1],
          })
        : false;
    }

    function split(arr) {
      for (let i in arr) {
        i = Number(i);
        if (Array.isArray(arr[i])) {
          let res = split(arr[i]);
          if (res) return arr.map((el, j) => (j === i ? res : el));
        } else if (arr[i] >= 10) {
          splitted = true;
          return arr.map((el, j) =>
            j === i ? [Math.floor(el / 2), Math.ceil(el / 2)] : el
          );
        }
      }
      return false;
    }

    let result;
    result = explode(line, 1, deepest(line));
    // if (result) console.log("exploded", JSON.stringify(result));
    if (!result) {
      result = split(line);
      // if (result) console.log("splitted", JSON.stringify(result));
      //else console.log("done", JSON.stringify(line));
    }

    if (result) line = result.map((a) => a);
  }
  // console.log();
  return line;
}

// console.log(JSON.stringify(reduce([data[0], data[1]])));
// process.exit(0);

function magnitude(arr) {
  if (Array.isArray(arr)) {
    const [left, right] = arr;
    return 3 * magnitude(left) + 2 * magnitude(right);
  }
  return arr;
}

const result = data.reduce((sum, el, i) => (i === 0 ? el : reduce([sum, el])));
console.log(JSON.stringify(result));
console.log(magnitude(result));

let sums = [];
for (let x of data) {
  for (let y of data) {
    if (x !== y) sums.push(magnitude(reduce([x, y])));
  }
}
console.log(Math.max(...sums));
