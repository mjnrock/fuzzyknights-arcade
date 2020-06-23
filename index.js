// import Registry from "./Registry";

// let r = new Registry();

// console.log(r);

// console.log(1)

import Tile from "./Tile";

let t = new Tile();
t.onActivate = console.log;

t.activate();

console.log(t);