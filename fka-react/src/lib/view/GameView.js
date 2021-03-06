import Game from "./../Game";
import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
import { EnumComponentType } from "../entity/components/Component";

//TODO This needs to be more exposed and readable so things like PlayerActionBar.jsx can display the appropriate key/mouse bindings, and so a synthetic control event can be invoked so as to execute the respective Action
export const Controls = {
    key: [
        [ 114, function() { Game.$.setting("isDebugMode", !Game.$.setting("isDebugMode")) } ],
        [ 86, function() { 
            Game.$.setting("showNameplates", !Game.$.setting("showNameplates"));
            this.camera.getLayer("HUD").isActive = Game.$.setting("showNameplates");
        } ],
        [ 90, function() { Game.$.setting("showUI", !Game.$.setting("showUI"))
        } ],
        [ 46, function() {
            const node = Game.$.graph.getNode(0, 0);
            node.entities.clear();
            node.addEntity(Game.$.player);
        } ],
        [ 122, function() {
            //? Fullscreen the Canvas on F11
            const elem = document.getElementById("game-view");
            if(elem) {
                if(elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if(elem.mozRequestFullScreen) { /* Firefox */
                    elem.mozRequestFullScreen();
                } else if(elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    elem.webkitRequestFullscreen();
                } else if(elem.msRequestFullscreen) { /* IE/Edge */
                    elem.msRequestFullscreen();
                }
            }
        } ],
        [ 192, function() {
            //? Throw data at console on `
            const storage = Game.$.player.getComponent(EnumComponentType.STORAGE);
            console.log(Game.$.player);
            console.log(storage.bags.toItemStackArray());
            console.log(storage.equipment.toItemStackArray());
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
        [ 0, function(...args) {
            Game.$.player.perform(0, ...args);
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
            }
        });

        for(let key of controls.key) {
            this.bindKey(...key);
        }
        for(let mouse of controls.mouse) {
            this.bindMouse(...mouse);
        }

        this.camera = camera;
        this.controls = {
            cursor: {
                x: 0,
                y: 0,
                tx: 0,
                ty: 0,
                theta: 0,
            },
        };
    }

    get cursor() {
        return this.controls.cursor;
    }
    set cursor(ts) {
        if(!Array.isArray(ts)) {
            return this;
        }

        this.controls.cursor = {
            x: ts[ 0 ],
            y: ts[ 1 ],
            tx: ts[ 2 ],
            ty: ts[ 3 ],
            theta: ts[ 4 ],
        };
        
        return this;
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
            if(Game.$.react.canvas) {
                const { top, left, bottom, right } = Game.$.react.canvas.getBoundingClientRect();
                const { x, y } = msg.payload;

                if(x >= left && x <= right && y >= top && y <= bottom) {
                    const { x0, y0 } = this.camera.pos;
                    let tx = (x - left) / this.camera.tw;
                    let ty = (y - top) / this.camera.th;

                    tx += x0;
                    ty += y0;
                    
                    const comp = Game.$.player.getComponent(EnumComponentType.RIGID_BODY);
                    this.cursor = [ x - left, y - top, tx, ty, comp ? Math.atan2(ty - comp.y, tx - comp.x) : null ];

                    this.dispatch(type, this.cursor);
                }
            }
        }
    }
}