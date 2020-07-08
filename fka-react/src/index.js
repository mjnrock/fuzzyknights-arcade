import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";

import GameView from "./lib/view/GameView";

let gv = new GameView();
console.log(gv);

ReactDOM.render(
    <App />,
    document.getElementById("root")
);