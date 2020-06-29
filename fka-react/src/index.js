import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";

import MouseNode from "./lib/hive/MouseNode";

const mouseNode = new MouseNode({ element: window });
mouseNode.addEffect((state, msg) => {
    console.log(msg.payload)
});

ReactDOM.render(
    <App />,
    document.getElementById("root")
);