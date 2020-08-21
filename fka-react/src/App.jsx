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
import Requirements from "./lib/combat/requirement/package";
import { EnumState } from "./lib/entity/components/State";
import { EnumEventType as EnumEntityEventType } from "./lib/entity/Entity";
import { EnumResourceType } from "./lib/entity/components/Life";
import EnumDamageType from "./lib/combat/DamageType";
import EntityProjectile from "./lib/entity/EntityProjectile";



import Registry from "./lib/util/Registry";

const reg = new Registry();
reg.create({
    key: [ "test", "bob" ],
    value: 3
});
reg.create(19);

console.log(reg.get("test"));
console.log(reg.get("bob"));
console.log(reg.get(reg.find("test").id));
console.log(reg.find("test"));
console.log(reg.entries);



Game.$.graph = Graph.Factory.Generate(2, 2, 20, 20, [
    [ [ 0, 0 ], 10, 0, [ 1, 0 ], 10.5, 18.5 ],
    [ [ 1, 0 ], 10, 19, [ 0, 0 ], 10.5, 1.5 ],
]);

const node = Game.$.graph.getNode(0, 0);

const entity = new EntityCreature({
    comps: [
        new Capabilities({
            library: [
                Action.Ability({
                    name: "attack",
                    state: EnumState.ATTACKING,
                    effects: [
                        new Effects.Damage(EnumDamageType.PHYSICAL, 1, Effects.Effect.IgnoreInvoker),
                        new Effects.Knockback(0.05, Effects.Effect.IgnoreInvoker),
                    ],
                    cooldown: 667,
                    model: new Models.Circle(64),
                }),
                Action.Ability({
                    name: "defend",
                    state: EnumState.DEFENDING,
                    effects: [
                        new Effects.Heal(10, Effects.Effect.OnlyInvoker),
                    ],
                    cooldown: 333,
                    model: new Models.Circle(64),
                }),
                Action.Ability({
                    name: "fireball",
                    // state: EnumState.CASTING,
                    state: EnumState.IDLE,
                    requirements: [
                        new Requirements.Resource(EnumResourceType.ENERGY, 1),
                    ],
                    effects: [
                        new Effects.Spawn(() => new EntityProjectile({    //? Needs to be a "generator" function, otherwise keeps spawning same instance
                            lifespan: 1000,
                            model: [ 24 ],
                            speed: 5.0,
                            hooks: {
                                [ EnumEntityEventType.COLLISION ]: function(target) {
                                    if(this.parent !== target) {
                                        this.node.entityManager.kill(target);
                                        this.node.entityManager.kill(this);
                                    }
                                }
                            }
                        }), Effects.Effect.OnlyInvoker),
                    ],
                    cooldown: 333,
                    model: new Models.Circle(32),
                }),
            ]
        })
    ],
    data: {
        [ EnumComponentType.RIGID_BODY ]: {
            x: 10,
            y: 1,
            speed: 2.00,
            // model: new Models.Line(128, 128),
            model: new Models.Circle(24),
        },
        //TODO This ONLY does a key:value set; modify to be a function that passes the Component as parameter, and sets Component to returned value
        // [ EnumComponentType.LIFE ]: {
        //     hp: [ 25, 0, 25 ],
        //     energy: [ 10, 0, 10 ],
        // }
    }
});

node.addEntity(entity);
Game.$.player = entity;

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

console.log(Game.$)
console.log(Game.$.player)

Game.$.view = new GameView(Game.$.graph, {
    camera: new RenderCamera(Game.$.graph.getNode(0, 0), {
        tw: 128,
        th: 128,
        scale: 1.0,

        //* Viewport Config
        x: 0,   // Only relevant w/o a subject
        y: 0,   // Only relevant w/o a subject
        w: 9,
        h: 7,

        subject: Game.$.player,
    }),
    controls: GameViewControls
});
Game.$.start();

export const Context = React.createContext(Game.$.view.camera);

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Context.Provider value={{ node: Game.$.view.camera }}>
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