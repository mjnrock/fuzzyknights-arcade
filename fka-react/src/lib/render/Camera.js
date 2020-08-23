import Game from "./../Game";
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
import SWORD_IDLE from "./sequencer/data/sword.idle.json";
import SWORD_ATTACKING from "./sequencer/data/sword.attacking.json";
import SHIELD_IDLE from "./sequencer/data/shield.idle.json";
import SHIELD_BLOCK from "./sequencer/data/shield.block.json";
import TREE from "./sequencer/data/tree-2.json";
import DebugLayer from "./DebugLayer";
import Composition from "./sequencer/Composition";

//  STUB
const CookedBook = new Book();
Promise.all([
    Score.Deserialize(RACCOON_IDLE).then(score => CookedBook.set("raccoon.idle", score)),
    Score.Deserialize(RACCOON_RUNNING).then(score => CookedBook.set("raccoon.running", score)),
    Score.Deserialize(RACCOON_TAILWHIP).then(score => CookedBook.set("raccoon.tailwhip", score)),
    Score.Deserialize(RACCOON_TUCK).then(score => CookedBook.set("raccoon.tuck", score)),
    Score.Deserialize(SPELL_FIREBALL).then(score => CookedBook.set("spell.fireball", score)),
    Score.Deserialize(SWORD_IDLE).then(score => CookedBook.set("sword.idle", score)),
    Score.Deserialize(SHIELD_IDLE).then(score => CookedBook.set("shield.idle", score)),
    Score.Deserialize(SWORD_ATTACKING).then(score => CookedBook.set("sword.attacking", score)),
    Score.Deserialize(SHIELD_BLOCK).then(score => CookedBook.set("shield.defending", score)),
    Score.Deserialize(TREE).then(score => CookedBook.set("tree", score)),
]).then(() => {    
    CookedBook.set("player.idle", new Composition([
        [ "body", CookedBook.get("raccoon.idle") ],
        [ "right", CookedBook.get("sword.idle") ],
        [ "left", CookedBook.get("shield.idle") ],
    ]));
    CookedBook.set("player.attacking", new Composition([
        [ "body", CookedBook.get("raccoon.idle") ],
        [ "right", CookedBook.get("sword.attacking") ],
        [ "left", CookedBook.get("shield.idle") ],
    ]));
    CookedBook.set("raccoon.running", new Composition([
        [ "body", CookedBook.get("raccoon.running") ],
        [ "right", CookedBook.get("sword.idle") ],
        [ "left", CookedBook.get("shield.idle") ],
    ]));
    CookedBook.set("raccoon.tuck", new Composition([
        [ "body", CookedBook.get("raccoon.tuck") ],
        [ "left", CookedBook.get("shield.defending") ],
    ]));
});

export default class Camera extends LayeredCanvasNode {
    constructor(node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0, rotation = 0, translation = [ 0, 0 ] } = {}) {
        super({
            state: {
                game: Game.$,   //  NOTE    See note at this.game
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
        
        this.stack = [
            [ "terrain", new TerrainLayer(CookedBook, { width: this.width, height: this.height, tw, th, size }) ],
            [ "entity", new EntityLayer(CookedBook, { width: this.width, height: this.height, tw, th, size }) ],
            [ "HUD", new HUD(this) ],
            [ "debug", new DebugLayer({ width: this.width, height: this.height, tw, th, size }) ],
        ];
    
        this.ctx.translate(...translation);
        this.ctx.rotate(rotation * Math.PI / 180);   // Expects Degrees
    }

    get pos() {
        return {
            x0: this.state.viewport.x,
            y0: this.state.viewport.y,
            x1: this.state.viewport.x + this.state.viewport.width,
            y1: this.state.viewport.y + this.state.viewport.height,
        };
    }

    //  NOTE    Until a React refactor takes place, Camera (as the current "Context node" at the time of this comment), needs access to Game.$, so this is the working solution
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
        if(Game.$.react.canvas) {
            this.canvas = Game.$.react.canvas;
        }

        const viewport = this.viewport;
        const padding = 1;  //* This prevents a hard tile cutoff on render     

        //  FIXME   This is the rough idea, but it is not correct (cf. "fka-react/2020-08-21 11_41_16-Window.png")
        //  NOTE    The fix could compare the previous "aspect ratio" to the fullscreen canvas aspect ratio, and scale accordingly
        // if(document.fullscreenElement) {
        //     const width = window.innerWidth;
        //     const height = window.innerHeight;
            
        //     viewport.pixel.width = width;
        //     viewport.pixel.height = height;
        //     viewport.tile.width = ~~(width / this.tw);
        //     viewport.tile.height = ~~(height / this.th);
        // }
        
        //TODO  Fullscreen changes something about the cursor position, and as a result, completely breaks the mouse-to-player relation

        const drawArgs = {
            node: this.node,
            x0: viewport.tile.x0 - padding,
            y0: viewport.tile.y0 - padding,
            x1: viewport.tile.x1 + padding,
            y1: viewport.tile.y1 + padding,
        };

        this.getLayer("terrain").draw(drawArgs);
        this.getLayer("entity").draw(drawArgs);
        this.getLayer("HUD").draw(drawArgs);
        this.getLayer("debug").draw(drawArgs);

        // console.log(this.getLayer("HUD").canvas.toDataURL())

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.resize(viewport.pixel.width * this.scale, viewport.pixel.height * this.scale);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.prop({ fillStyle: "#000" }).rect(0, 0, this.width, this.height, { isFilled: true });
        
        if(this.subject) {
            const comp = this.subject.getComponent(EnumComponentType.RIGID_BODY);
            const vw2 = ~~(viewport.pixel.width / 2);
            const vh2 = ~~(viewport.pixel.height / 2);

            this.paint(
                (comp.x * this.tw) - vw2,
                (comp.y * this.th) - vh2,
                viewport.pixel.width,
                viewport.pixel.height,
                0,
                0,
                viewport.pixel.width,
                viewport.pixel.height,
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
                viewport.pixel.x0,
                viewport.pixel.y0,
                viewport.pixel.width,
                viewport.pixel.height,
                0,
                0,
                viewport.pixel.width,
                viewport.pixel.height,
            );
        }
        this.ctx.restore();
    }
};