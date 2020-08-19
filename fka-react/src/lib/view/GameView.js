import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";

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

        [ 49, function() {
            this.game.player.perform(this.game, 0);
        } ],
        [ 50, function() {
            this.game.player.perform(this.game, 1);
        } ],
        [ 51, function() {
            this.game.player.perform(this.game, 2);
        } ],
    ],
    mouse: [
        [ 0, function(e) {
            this.game.player.perform(this.game, 0, e);
        } ],
        [ 1, function(e) {
            this.game.player.perform(this.game, 1, e);
        } ],
        [ 2, function(e) {
            this.game.player.perform(this.game, 2, e);
        } ],
    ]
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
                
                //TODO Store the relevant Mouse and Key data in the Game object, itself (i.e. cursor position, key mask, etc.), so Game can control Player-based events easily
                // if(msg.type === EnumMouseMessageType.MOUSE_MOVE) {
                //     const [ xc, yc ] = [ this.game.view.camera.width / 2, this.game.view.camera.height / 2 ];
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