import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

import Graph from "./lib/graph/package";
import RenderNode from "./lib/render/graph/RenderNode";

const graph = Graph.GraphFactory.Generate(1, 1, 20, 20);
console.log(graph)
const node = graph.getNode(0, 0);
console.log(node)
const renderNode = new RenderNode(node, { size: [ 128, 128 ]});

renderNode.getLayer(1).loadImage("raccoon", "./assets/entity/raccoon.png").then(() => {
    node.addEntity(1);
    renderNode.draw();
});

export const Context = React.createContext(renderNode);

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Context.Provider value={{ node: renderNode }}>
                    <Switch>                            
                        <Route path="/">
                            <Routes.Home />
                        </Route>
                    </Switch>
                </Context.Provider>
            </ScrollToTop>
        </Router>
    )
}

export default App;