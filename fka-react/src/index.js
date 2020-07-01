import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";

// import Hive from "@lespantsfancy/hive";
// const mouseNode = new Hive.Client.MouseNode({ element: window });
// console.log(Hive)

import MouseNode from "./lib/hive/MouseNode";
import KeyNode from "./lib/hive/KeyNode";

const mouseNode = new MouseNode({ element: document.getElementById("root") });
mouseNode.addEffect((state, msg) => {
    console.log(msg.type, msg.payload)
});
const keyNode = new KeyNode({ element: window });
keyNode.addEffect((state, msg) => {
    console.log(msg.type, msg.payload)
});

ReactDOM.render(
    <App />,
    document.getElementById("root")
);