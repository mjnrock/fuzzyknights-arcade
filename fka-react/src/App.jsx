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
import { NormalizeTheta } from "./lib/hive/Helper";

import Models from "./lib/model/package";
import Capabilities from "./lib/entity/components/Capabilities";

//  STUB
//- Capabilities Imports
import Action from "./lib/combat/Action";
import Effects from "./lib/combat/effect/package";
import { EnumState } from "./lib/entity/components/State";
import { EnumResourceType } from "./lib/entity/components/Life";
import EntityParticle from "./lib/entity/EntityParticle";
import Elapsable from "./lib/entity/components/lib/Elapsable";

const game = new Game();
game.graph = Graph.Factory.Generate(2, 2, 20, 20, game);

const node = game.graph.getNode(0, 0);
const entity = new EntityCreature({
    comps: [
        new Capabilities({
            library: [
                Action.Ability({
                    name: "attack",
                    state: EnumState.ATTACKING,
                    effects: [
                        new Effects.Damage(1, Effects.Effect.IgnoreInvoker),
                        new Effects.Knockback(0.05, Effects.Effect.IgnoreInvoker),
                    ],
                    duration: 667,
                    model: new Models.Circle(64),
                }),
                Action.Ability({
                    name: "defend",
                    state: EnumState.DEFENDING,
                    cost: [ 1, EnumResourceType.ENERGY ],
                    effects: [
                        new Effects.Heal(10, Effects.Effect.OnlyInvoker),
                    ],
                    duration: 333,
                    model: new Models.Circle(64),
                }),
                Action.Ability({
                    name: "fireball",
                    // state: EnumState.CASTING,
                    state: EnumState.IDLE,
                    // cost: [ 1, EnumResourceType.MANA ],
                    effects: [
                        //TODO Refactor Spawnables to facilitate spawning, facing/velocity (via mouse position), and onCollision event
                        //  STUB    EntityParticle is not the appropriate entity
                        new Effects.Spawn(() => new EntityParticle({    //? Needs to be a "generator" function, otherwise keeps spawning same instance
                            lifespan: 1000,
                            data: {
                                [ EnumComponentType.RIGID_BODY ]: {
                                    speed: 5.0,
                                    model: new Models.Circle(24),
                                },
                                [ EnumComponentType.STATE ]: {
                                    default: new Elapsable(Infinity, {
                                        data: {
                                            value: EnumState.MOVING,
                                        },
                                        startNow: true,
                                    })
                                },
                            }
                        }), Effects.Effect.OnlyInvoker),
                    ],
                    duration: 333,
                    model: new Models.Circle(32),
                }),
            ]
        })
    ],
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