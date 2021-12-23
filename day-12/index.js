const fs = require("fs");
const path = require("path");
const inputRaw = fs
  .readFileSync(path.join(__dirname, "input"))
  .toString("utf8")
  .split("\n");
const input = inputRaw.slice(0, inputRaw.length - 1);

const graph = {};
function add(key, value) {
  if (graph[key]) {
    graph[key].push(value);
  } else {
    graph[key] = [value];
  }
}
input.forEach((connection) => {
  const [key, value] = connection.split("-");
  add(key, value);
  if (key !== "start" && value !== "end") add(value, key);
});

function isLegal(point, path) {
  if (path.includes(point) && point.toLowerCase() === point) {
    return !Object.values(
      path
        .filter((a) => a.toLowerCase() === a)
        .reduce((counts, a) => ({ ...counts, [a]: (counts[a] ?? 0) + 1 }), {})
    ).some((a) => a > 1);
  }
  return true;
}

function paths(point = "start", path = []) {
  if (point === "end") {
    return [path.concat("end")];
  }
  if (point === "start" && path.length !== 0) return [];
  if (!isLegal(point, path)) return [];
  console.log(path.join(","));
  let forward = [];
  for (let next of graph[point] ?? []) {
    let nexts = paths(next, path.concat(point));
    for (let next of nexts) forward.push(next);
  }
  return forward;
}

const res = paths();
console.log(res.length);
