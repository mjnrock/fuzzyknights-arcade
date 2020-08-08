// import { NormalizeTheta } from "./../hive/Helper";
import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
import RenderCamera from "../render/Camera";
import Models from "./../model/package";
// import EntityAction from "../entity/EntityAction";

// import { EnumComponentType } from "./../entity/components/Component";
// import Arc from "../model/Arc";
import Action from "../combat/Action";
import Effects from "./../combat/effect/package";

export const Controls = {
    key: [
        [ 114, function() { this.game.setting("isDebugMode", !this.game.setting("isDebugMode")) } ],
        [ 86, function() { 
            this.game.setting("showNameplates", !this.game.setting("showNameplates"));
            this.camera.HUD.isActive = this.game.setting("showNameplates");
        } ],
        [ 46, function() {
            const node = this.game.graph.getNode(0, 0);
            node.entities.clear();
            node.addEntity(this.game.player);
        } ],
    ],
    mouse: [
        [ 0, function(payload) {
            this.game.player.perform(
                this.game,
                Action.Ability({
                    cost: 0,
                    effects: [
                        new Effects.Damage(1, { ignore: (ea, target) => target === this.game.player }),
                        new Effects.Knockback(0.05, { ignore: (ea, target) => target === this.game.player }),
                    ],
                    lifespan: 1,
                    model: new Models.Circle(64),
                })
            );
        } ],
        [ 2, function(payload) {
            this.game.player.perform(
                this.game,
                Action.Ability({
                    cost: 1,
                    effects: [
                        new Effects.Heal(1, { only: (ea, target) => target === this.game.player }),
                        // new Effects.Move(1, 1, { only: entity => entity === this.game.player }),
                    ],
                    lifespan: 1,
                    model: new Models.Circle(64),
                })
            );
        } ],
        // [ 2, function(payload) {
        //     //  STUB    Spawn Arc entity on "LEFT" button
        //     const dx = payload.x - window.innerWidth / 2;
        //     const dy = payload.y - window.innerHeight / 2;
        //     const theta = NormalizeTheta(dx, dy);
        //     const graph = this.getGraph();

        //     let tl = this.game.player.pos.facing - 35;
        //     let tr = this.game.player.pos.facing + 35;
            
        //     graph.getNode(0, 0).addEntity(new EntityAction({
        //         x: this.game.player.pos.x,
        //         y: this.game.player.pos.y,
        //         data: {
        //             [ EnumComponentType.RIGID_BODY ]: {
        //                 facing: NormalizeTheta(dx, dy, { toNearestDegree: 45 }),
        //                 model: new Arc(40, tl, tr),
        //                 vx: 3.50 * Math.cos((theta - 90) / 180 * Math.PI),
        //                 vy: 3.50 * Math.sin((theta - 90) / 180 * Math.PI),
        //             }
        //         },
        //         parent: this.game.player,
        //     }));
        //     graph.getNode(0, 0).addEntity(new EntityAction({
        //         x: this.game.player.pos.x,
        //         y: this.game.player.pos.y,
        //         data: {
        //             [ EnumComponentType.RIGID_BODY ]: {
        //                 facing: NormalizeTheta(dx, dy, { toNearestDegree: 45 }),
        //                 model: new Arc(40, tl - 15, tr),
        //                 vx: 3.50 * Math.cos((theta - 105) / 180 * Math.PI),
        //                 vy: 3.50 * Math.sin((theta - 90) / 180 * Math.PI),
        //             }
        //         },
        //         parent: this.game.player,
        //     }));
        //     graph.getNode(0, 0).addEntity(new EntityAction({
        //         x: this.game.player.pos.x,
        //         y: this.game.player.pos.y,
        //         data: {
        //             [ EnumComponentType.RIGID_BODY ]: {
        //                 facing: NormalizeTheta(dx, dy, { toNearestDegree: 45 }),
        //                 model: new Arc(40, tl, tr + 15),
        //                 vx: 3.50 * Math.cos((theta - 90) / 180 * Math.PI),
        //                 vy: 3.50 * Math.sin((theta - 75) / 180 * Math.PI),
        //             }
        //         },
        //         parent: this.game.player,
        //     }));
        // } ],
    ]
};

export const StubCamera = (game, graph) => {
    const camera = new RenderCamera(game, graph.getNode(0, 0), {
        tw: 128,
        th: 128,
        scale: 1.0,

        //* Viewport Config
        x: 0,
        y: 0,
        w: 9,
        h: 7,

        subject: game.player,
    });

    camera.getLayer(0).loadImages([
        [ "terrain.grass", "./assets/terrain/grass.png" ],
        [ "terrain.dirt", "./assets/terrain/dirt.png" ],
        [ "terrain.stone", "./assets/terrain/stone.png" ],
    ]).then(() => {
        camera.getLayer(1).loadImages([
            [ "entity.raccoon", "./assets/entity/raccoon.png" ],
            [ "entity.beaver", "./assets/entity/beaver.png" ],
            [ "entity.rabbit", "./assets/entity/rabbit.png" ],
            [ "entity.walrus", "./assets/entity/walrus.png" ],
            [ "entity.bull", "./assets/entity/bull.png" ],
            [ "entity.particle.poof", "./assets/entity/poof.png" ],
        ]).then(() => {
            camera.getLayer(0).draw();
            
            //TODO GameLoop currently utilizes MainLoop, build up rendering manager paradigm and transfer Camera and rendering to its .draw()
            game.start();
            // camera.play();
        });  
    });

    return camera;
};

export default class GameView extends View {
    constructor(game, graph, { camera, controls = {} } = {}) {
        super(game);

        this.mouse.mergeConfig({
            moveRequiresButton: false,
        });

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect((state, msg) => {
            if(msg.type === EnumKeyMessageType.KEY_MASK || msg.type === EnumMouseMessageType.MOUSE_MOVE) {
                graphComp.receive.call(graphComp, state, msg);
            }
        });

        for(let key of controls.key) {
            this.bindKey(...key);
        }
        for(let mouse of controls.mouse) {
            this.bindMouse(...mouse);
        }

        this.camera = camera;
    }

    getGraph() {
        return this.get("graph").get();
    }
    setGraph(graph) {
        return this.get("graph").set(graph);
    }

    receive(type, payload, msg) {
        if(type === EnumKeyMessageType.KEY_MASK) {
            this.dispatch(type, {
                map: this.key.map,
                mask: payload
            });
        } else if(type === EnumKeyMessageType.KEY_PRESS) {
            this.dispatch(type, msg.payload);
        } else if(type === EnumMouseMessageType.MOUSE_MOVE) {
            this.dispatch(type, msg.payload);
        }
    }
}