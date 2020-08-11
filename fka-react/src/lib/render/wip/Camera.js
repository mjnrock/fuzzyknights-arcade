import LayeredCanvasNode from "../../hive/LayeredCanvasNode";
import EntityLayer from "./EntityLayer";
import TerrainLayer from "./TerrainLayer";

import { EnumComponentType } from "./../../entity/components/Component";

import Score from "./../sequencer/Score";
import Book from "./Book";
import RACCOON_IDLE from "./../sequencer/data/raccoon.idle.json";
import RACCOON_RUNNING from "./../sequencer/data/raccoon.running.json";
import RACCOON_TAILWHIP from "./../sequencer/data/raccoon.tailwhip.json";

const CookedBook = new Book();
Score.Deserialize(RACCOON_IDLE).then(score => CookedBook.set("raccoon.idle", score));
Score.Deserialize(RACCOON_RUNNING).then(score => CookedBook.set("raccoon.running", score));
Score.Deserialize(RACCOON_TAILWHIP).then(score => CookedBook.set("raccoon.tailwhip", score));

export default class Camera extends LayeredCanvasNode {
    constructor(game, node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0 } = {}) {
        super({
            state: {
                game: game,
                node: node,
                viewport: {
                    x,
                    y,
                    width: w,
                    height: h,
                },
                subject,
                scale,
            },
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [                
                [ "terrain", new TerrainLayer(CookedBook, { width: node.tiles.width * (size[ 0 ] || tw), height: node.tiles.height * (size[ 1 ] || th), tw, th, size }) ],
                [ "entity", new EntityLayer(CookedBook, { width: node.tiles.width * (size[ 0 ] || tw), height: node.tiles.height * (size[ 1 ] || th), tw, th, size }) ],
                // [ "terrain", new RenderNodeTerrain(node, { tw, th, size }) ],
                // [ "entity", new RenderNodeEntity(node, { tw, th, size }) ],
            ],
        });
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
            // const viewport = this.viewport;
            // layer.draw({
            //     game: this.game,
            //     node: this.node,
            // });
            //TODO Compare to Entities.RenderNode, Terrain.RenderNode, and Layered/Grid/CanvasNode for functionality
            //TODO Only render what is within the viewport of the Camera
            
        }
    }

    draw(...args) {
        this.getLayer("terrain").draw({
            game: this.game,
            node: this.node,
        });
        this.getLayer("entity").draw({
            game: this.game,
            node: this.node,
        });

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.resize(this.viewport.pixel.width * this.scale, this.viewport.pixel.height * this.scale);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.prop({ fillStyle: "#000" }).rect(0, 0, this.width, this.height, { isFilled: true });

        if(this.subject) {
            const comp = this.subject.getComponent(EnumComponentType.RIGID_BODY);
            const vw2 = ~~(this.viewport.pixel.width / 2);
            const vh2 = ~~(this.viewport.pixel.height / 2);

            this.paint(
                (comp.x * this.tw) - vw2,
                (comp.y * this.th) - vh2,
                this.viewport.pixel.width,
                this.viewport.pixel.height,
                0,
                0,
                this.width,
                this.height,
            );

            this.mergeState({
                viewport: {
                    ...this.state.viewport,

                    x: ((comp.x * this.tw) - vw2) / this.tw,
                    y: ((comp.y * this.th) - vh2) / this.th,
                }
            });
        } else {
            this.paint(
                this.viewport.pixel.x0,
                this.viewport.pixel.y0,
                this.viewport.pixel.width,
                this.viewport.pixel.height,
                0,
                0,
                Math.min(this.viewport.pixel.width, this.width),
                Math.min(this.viewport.pixel.height, this.height),
            );
        }
        this.ctx.restore();
    }
};