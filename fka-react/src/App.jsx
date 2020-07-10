import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import Routes from "./routes/package";

import Game from "./lib/Game";

import Graph from "./lib/graph/package";
import GameView from "./lib/view/GameView";
import Entity from "./lib/entity/Entity";
import { EnumComponentType } from "./lib/entity/components/Component";

const game = new Game();
game.graph = Graph.Factory.Generate(2, 2, 20, 20);

const node = game.graph.getNode(0, 0);
const entity = new Entity({
    data: {
        [ EnumComponentType.POSITION ]: {
            x: 5,
            y: 5,
        }
    }
});
node.addEntity(entity);
game.player = entity;

game.view = new GameView(game, game.graph);

export const Context = React.createContext(game.view.camera);

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Context.Provider value={{ node: game.view.camera }}>
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