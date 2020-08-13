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
import GameView, { Controls as GameViewControls } from "./lib/view/GameView";
import RenderCamera from "./lib/render/Camera";
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
            speed: 2.00,
            // model: new Models.Line(128, 128),
            model: new Models.Circle(24),
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
                speed: 3.50,
                model: new Models.Circle(24),
                facing: NormalizeTheta((Math.random() > 0.5 ? -1 : 1) * Math.random(), (Math.random() > 0.5 ? -1 : 1) * Math.random(), { toNearestDegree: 45 }),
            }
        }
    });

    node.addEntity(e2);
}

console.log(game)
console.log(game.player)

//  FIXME   RenderCamera needs to be under a render manager
game.view = new GameView(game, game.graph, {
    camera: new RenderCamera(game, game.graph.getNode(0, 0), {
        tw: 128,
        th: 128,
        scale: 1.0,

        //* Viewport Config
        x: 0,   // Only relevant w/o a subject
        y: 0,   // Only relevant w/o a subject
        w: 9,
        h: 7,

        subject: game.player,
    }),
    controls: GameViewControls
});
game.start();

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