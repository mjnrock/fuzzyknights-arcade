import LayeredCanvasNode from "../../hive/LayeredCanvasNode";
import RenderNodeTerrain from "./../graph/Terrain.RenderNode";
import RenderNodeEntities from "./../graph/Entities.RenderNode";

import Troupe from "./Troupe";

export default class Camera extends LayeredCanvasNode {
    constructor(game, node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0 } = {}) {
        super({
            state: {
                game: game,
                viewport: {
                    x,
                    y,
                    width: w,
                    height: h,
                },
                subject,
                scale,
                troupes: new Map(),
            },
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [                
                [ "terrain", new RenderNodeTerrain(node, { tw, th, size }) ],
                [ "entity", new RenderNodeEntities(node, { tw, th, size }) ],
            ],
        });
    }

    enlist(nameOrIndex, troupe) {
        this.troupes.set(nameOrIndex, troupe);

        return this;
    }
    dismiss(nameOrIndex) {
        this.troupes.delete(nameOrIndex);

        return this;
    }

    get troupes() {
        return this.state.troupes;
    }

    get game() {
        return this.state.game;
    }

    get scale() {
        return this.state.scale;
    }
    set scale(scale) {
        this.state.scale = scale;
    }

    get subject() {
        return this.state.subject;
    }
    set subject(subject) {
        this.state.subject = subject;
    }

    desubject() {
        this.state.subject = null;

        return this;
    }

    get viewport() {
        const obj = {
            tile: {
                x0: typeof this.state.viewport.x === "number" ? this.state.viewport.x : 0,
                y0: typeof this.state.viewport.y === "number" ? this.state.viewport.y : 0,
                x1: typeof this.state.viewport.x === "number" && typeof this.state.viewport.width === "number" ? this.state.viewport.x + this.state.viewport.width : this.node.tiles.width,
                y1: typeof this.state.viewport.y === "number" && typeof this.state.viewport.height === "number" ? this.state.viewport.y + this.state.viewport.height : this.node.tiles.height,
                width: typeof this.state.viewport.width === "number" ? this.state.viewport.width : this.node.tiles.width,
                height: typeof this.state.viewport.height === "number" ? this.state.viewport.height : this.node.tiles.height,
            },
            pixel: {
                x0: 0,
                y0: 0,
                x1: null,
                y1: null,
                width: this.width,
                height: this.height,
            }
        };

        obj.pixel.width = obj.tile.width * this.tw;
        obj.pixel.height = obj.tile.height * this.th;
        obj.pixel.x1 = obj.tile.x1 * this.tw;
        obj.pixel.y1 = obj.tile.y1 * this.th;

        return obj;
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    drawLayer(nameOrIndex, ...args) {
        const layer = this.getLayer(nameOrIndex);

        if(layer) {
            const viewport = this.viewport;
            //TODO Compare to Entities.RenderNode, Terrain.RenderNode, and Layered/Grid/CanvasNode for functionality
            //TODO Only render what is within the viewport of the Camera
        }
    }

    draw(...args) {

    }
};