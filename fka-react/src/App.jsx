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
import EntityCreature from "./lib/entity/EntityCreature";
import { EnumComponentType } from "./lib/entity/components/Component";

import Models from "./lib/model/package";

const game = new Game();
game.graph = Graph.Factory.Generate(2, 2, 20, 20, game);

const node = game.graph.getNode(0, 0);
const entity = new EntityCreature({
    data: {
        [ EnumComponentType.RIGID_BODY ]: {
            x: 3,
            y: 3,
            speed: 3.50,
            // model: new Models.Line(128, 128),
            model: new Models.Circle(32),
        }
    }
});
const e2 = new EntityCreature({
    data: {
        [ EnumComponentType.RIGID_BODY ]: {
            x: 5,
            y: 5,
            speed: 1.00,
            model: new Models.Circle(32),
        }
    }
});
node.addEntity(entity);
node.addEntity(e2);
game.player = entity;

console.log(game)
console.log(game.player)

game.channel("graph").join(console.log, { ignore: [ "PLAYER_FACING" ] })

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