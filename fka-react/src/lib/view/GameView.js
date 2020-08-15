import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
// import RenderCamera from "../render/Camera";
// import RenderCamera from "../render/wip/Camera";
// import Models from "./../model/package";

// import Action from "../combat/Action";
// import Effects from "./../combat/effect/package";
// import { EnumState } from "../entity/components/State";
// import Effect from "../combat/effect/Effect";
// import { EnumResourceType } from "../entity/components/Life";

export const Controls = {
    key: [
        [ 114, function() { this.game.setting("isDebugMode", !this.game.setting("isDebugMode")) } ],
        [ 86, function() { 
            this.game.setting("showNameplates", !this.game.setting("showNameplates"));
            this.camera.getLayer("HUD").isActive = this.game.setting("showNameplates");
        } ],
        [ 46, function() {
            const node = this.game.graph.getNode(0, 0);
            node.entities.clear();
            node.addEntity(this.game.player);
        } ],
    ],
    mouse: [
        [ 0, function(payload) {
            this.game.player.perform(this.game, 0);
        } ],
        [ 2, function(payload) {
            // this.game.player.perform(this.game, 1);
            this.game.player.perform(this.game, 2);
        } ],
    ]
};

// export const StubCamera = (game, graph) => {
//     const camera = new RenderCamera(game, graph.getNode(0, 0), {
//         tw: 128,
//         th: 128,
//         scale: 1.0,

//         //* Viewport Config
//         x: 0,   // Only relevant w/o a subject
//         y: 0,   // Only relevant w/o a subject
//         w: 9,
//         h: 7,

//         subject: game.player,
//     });

//     camera.getLayer(0).loadImages([
//         [ "terrain.grass", "./assets/terrain/grass.png" ],
//         [ "terrain.dirt", "./assets/terrain/dirt.png" ],
//         [ "terrain.stone", "./assets/terrain/stone.png" ],
//     ]).then(() => {
//         camera.getLayer(1).loadImages([
//             [ "entity.raccoon", "./assets/entity/raccoon.png" ],
//             [ "entity.beaver", "./assets/entity/beaver.png" ],
//             [ "entity.rabbit", "./assets/entity/rabbit.png" ],
//             [ "entity.walrus", "./assets/entity/walrus.png" ],
//             [ "entity.bull", "./assets/entity/bull.png" ],
//             [ "entity.particle.poof", "./assets/entity/poof.png" ],
//         ]).then(() => {
//             camera.getLayer(0).draw();
            
//             //TODO GameLoop currently utilizes MainLoop, build up rendering manager paradigm and transfer Camera and rendering to its .draw()
//             game.start();
//             // camera.play();
//         });  
//     });

//     return camera;
// };

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