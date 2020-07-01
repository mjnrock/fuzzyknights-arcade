import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

// import CanvasNode from "./lib/hive/CanvasNode";
import GraphFactory from "./lib/GraphFactory";
import RenderNode from "./lib/RenderNode";
import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

const graph = GraphFactory.Generate(1, 1, 20, 20);
console.log(graph)
const node = graph.getNode(0, 0);
console.log(node)
const renderNode = new RenderNode(node, { size: [ 50, 50 ]});

renderNode.draw();

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