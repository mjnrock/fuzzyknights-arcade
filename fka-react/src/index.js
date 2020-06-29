import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";

import Hive from "@lespantsfancy/hive";
// import MouseNode from "./lib/hive/MouseNode";

console.log(Hive)

const mouseNode = new Hive.Client.MouseNode({ element: window });
mouseNode.addEffect((state, msg) => {
    console.log(msg.payload)
});

ReactDOM.render(
    <App />,
    document.getElementById("root")
);