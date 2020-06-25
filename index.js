import GraphFactory from "./lib/GraphFactory";

const graph = GraphFactory.Generate(1, 1, 4, 4);
console.log(graph.nodes[ "0.0" ].getTiles());
// console.log(JSON.stringify(graph, null, 2));

// const node = graph.getNode(0, 0);
// console.log(node.neighbors(0, 0));