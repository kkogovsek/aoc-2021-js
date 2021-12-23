const carryLeft = Symbol.for("left");
const carryRight = Symbol.for("right");

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

let exploded = false;
function explode(arr, depth, targetDepth) {
  for (let el in arr) {
    el = Number(el);
    if (Array.isArray(arr[el])) {
      const explosion = explode(arr[el], depth + 1, targetDepth);
      if (explosion) {
        console.log("explosion");
        console.log("object", explosion);
        console.log("i=>arr", el, JSON.stringify(arr));
        console.log();
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
            } else if (i === el) return null;
            else return num;
          })
          .filter((a) => a !== null);
        console.log("first fold", JSON.stringify(newArr));
        console.log();
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
          } else if (el === i) return [...explosion];
          else return num;
        });
        console.log("subsequent fold", JSON.stringify(newArr));
        console.log();
        return Object.assign(
          newArr,
          addedLeft ? {} : { [carryLeft]: explosion[carryLeft] },
          addedRight ? {} : { [carryRight]: explosion[carryRight] }
        );
      }
    }
  }
  return depth >= 5 && depth === targetDepth
    ? Object.assign("explode", {
        [carryLeft]: arr[0],
        [carryRight]: arr[1],
      })
    : false;
}

const res = explode(
  eval("[[[[4],[5,4]],[[[7,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]"),
  1,
  deepest(
    eval("[[[[4],[5,4]],[[[7,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]")
  )
);
console.log(JSON.stringify(res));
