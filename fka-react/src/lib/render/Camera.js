import LayeredCanvasNode from "../hive/LayeredCanvasNode";
import EntityLayer from "./EntityLayer";
import TerrainLayer from "./TerrainLayer";
import HUD from "./HUD";

import { EnumComponentType } from "../entity/components/Component";

import Score from "./sequencer/Score";
import Book from "./Book";
import RACCOON_IDLE from "./sequencer/data/raccoon.idle.json";
import RACCOON_RUNNING from "./sequencer/data/raccoon.running.json";
import RACCOON_TAILWHIP from "./sequencer/data/raccoon.tailwhip.json";
import RACCOON_TUCK from "./sequencer/data/raccoon.tuck.json";
import SPELL_FIREBALL from "./sequencer/data/spell.fireball.json";
import DebugLayer from "./DebugLayer";

const CookedBook = new Book();
Score.Deserialize(RACCOON_IDLE).then(score => CookedBook.set("raccoon.idle", score));
Score.Deserialize(RACCOON_RUNNING).then(score => CookedBook.set("raccoon.running", score));
Score.Deserialize(RACCOON_TAILWHIP).then(score => CookedBook.set("raccoon.tailwhip", score));
Score.Deserialize(RACCOON_TUCK).then(score => CookedBook.set("raccoon.tuck", score));
Score.Deserialize(SPELL_FIREBALL).then(score => CookedBook.set("spell.fireball", score));

export default class Camera extends LayeredCanvasNode {
    constructor(game, node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0, rotation = 0, translation = [ 0, 0 ] } = {}) {
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
                rotation,
                translation,
            },
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [],
        });
        
        //TODO Strictly speaking, the layer canvases only need to be the size of the viewport, not the map
        
        this.stack = [
            [ "terrain", new TerrainLayer(CookedBook, { width: this.width, height: this.height, tw, th, size }) ],
            [ "entity", new EntityLayer(CookedBook, { width: this.width, height: this.height, tw, th, size }) ],
            [ "HUD", new HUD(this) ],
            [ "debug", new DebugLayer({ width: this.width, height: this.height, tw, th, size }) ],
        ];
    
        this.ctx.translate(...translation);
        this.ctx.rotate(rotation * Math.PI / 180);   // Expects Degrees
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
        if(this.subject) {
            const rb = this.subject.getComponent(EnumComponentType.RIGID_BODY);

            if(rb) {
                this.node = rb.node;
            }
        }
        
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    //TODO There is a jerkiness that needs smoothing that is particularly visible in the Terrain
    draw(...args) {
        const viewport = this.viewport;
        const padding = 1;  //* This prevents a hard tile cutoff on render
        const drawArgs = {
            game: this.game,
            node: this.node,
            x: viewport.tile.x0 - padding,
            y: viewport.tile.y0 - padding,
            w: viewport.tile.width + padding,
            h: viewport.tile.height + padding,
        };

        this.getLayer("terrain").draw(drawArgs);
        this.getLayer("entity").draw(drawArgs);
        this.getLayer("HUD").draw(drawArgs);
        this.getLayer("debug").draw(drawArgs);

        // console.log(this.getLayer("HUD").canvas.toDataURL())

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.resize(this.viewport.pixel.width * this.scale, this.viewport.pixel.height * this.scale);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.prop({ fillStyle: "#000" }).rect(0, 0, this.width, this.height, { isFilled: true });

        //TODO Fix the partial cutoff that render experiences upon moving; pad the total viewport size by 1 or 2 in all directions
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
                this.viewport.pixel.width,
                this.viewport.pixel.height,
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
                this.viewport.pixel.width,
                this.viewport.pixel.height,
            );
        }
        this.ctx.restore();
    }
};