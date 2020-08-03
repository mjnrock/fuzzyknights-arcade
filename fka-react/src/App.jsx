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
import GameView, { Controls as GameViewControls, StubCamera as GameViewStubCamera } from "./lib/view/GameView";
import EntityCreature from "./lib/entity/EntityCreature";
import { EnumComponentType } from "./lib/entity/components/Component";

import Models from "./lib/model/package";
import { NormalizeTheta } from "./lib/hive/Helper";

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
node.addEntity(entity);
game.player = entity;

for(let i = 0; i < 25; i++) {
    const e2 = new EntityCreature({
        data: {
            [ EnumComponentType.RIGID_BODY ]: {
                x: ~~(Math.random() * 20),
                y: ~~(Math.random() * 20),
                // vx: (Math.random() > 0.5 ? -1 : 1) * Math.random() * 2,
                // vy: (Math.random() > 0.5 ? -1 : 1) * Math.random() * 2,
                speed: 1.00,
                model: new Models.Circle(32),
                facing: NormalizeTheta((Math.random() > 0.5 ? -1 : 1) * Math.random(), (Math.random() > 0.5 ? -1 : 1) * Math.random(), { toNearestDegree: 45 }),
            }
        }
    });

    node.addEntity(e2);
}

console.log(game)
console.log(game.player)

// game.channel("graph").join(console.log, { ignore: [ "PLAYER_FACING" ] })

game.view = new GameView(game, game.graph, { camera: GameViewStubCamera(game, game.graph), controls: GameViewControls });

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