import Game from "./../Game";
import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";

export const Controls = {
    key: [
        [ 114, function() { Game.$.setting("isDebugMode", !Game.$.setting("isDebugMode")) } ],
        [ 86, function() { 
            Game.$.setting("showNameplates", !Game.$.setting("showNameplates"));
            this.camera.getLayer("HUD").isActive = Game.$.setting("showNameplates");
        } ],
        [ 46, function() {
            const node = Game.$.graph.getNode(0, 0);
            node.entities.clear();
            node.addEntity(Game.$.player);
        } ],

        [ 49, function() {
            Game.$.player.perform(0);
        } ],
        [ 50, function() {
            Game.$.player.perform(1);
        } ],
        [ 51, function() {
            Game.$.player.perform(2);
        } ],
    ],
    mouse: [
        [ 0, function(e) {
            Game.$.player.perform(0, e);
        } ],
        [ 1, function(e) {
            Game.$.player.perform(1, e);
        } ],
        [ 2, function(e) {
            Game.$.player.perform(2, e);
        } ],
    ]
};

export default class GameView extends View {
    constructor(graph, { camera, controls = {} } = {}) {
        super();

        this.mouse.mergeConfig({
            moveRequiresButton: false,
        });

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect((state, msg) => {
            if(msg.type === EnumKeyMessageType.KEY_MASK || msg.type === EnumMouseMessageType.MOUSE_MOVE) {
                graphComp.receive.call(graphComp, state, msg);
                
                //TODO Store the relevant Mouse and Key data in the Game object, itself (i.e. cursor position, key mask, etc.), so Game can control Player-based events easily
                // if(msg.type === EnumMouseMessageType.MOUSE_MOVE) {
                //     const [ xc, yc ] = [ Game.$.view.camera.width / 2, Game.$.view.camera.height / 2 ];
                //     theta = Math.atan2(e.y - yc, e.x - xc) * 180 / Math.PI;
                // }
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