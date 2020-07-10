import LayeredCanvasNode from "./../hive/LayeredCanvasNode";
import { EnumMessageType } from "./../hive/CanvasNode";
import { EnumComponentType } from "./../entity/components/Component";

import RenderNodeTerrain, { EnumMessageType as EnumNodeTerrainMessageType } from "./graph/Terrain.RenderNode";
import RenderNodeEntities, { EnumMessageType as EnumNodeEntitiesMessageType } from "./graph/Entities.RenderNode";

export default class Camera extends LayeredCanvasNode {
    constructor(node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0 } = {}) {
        super({
            state: {
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
                new RenderNodeTerrain(node, { tw, th, size }),
                new RenderNodeEntities(node, { tw, th, size }),
            ],
        });

        this.mergeState({
            node: node,
        });

        this.getLayer(0).addEffect(EnumNodeTerrainMessageType.PAINT, this.paint.bind(this));
        this.getLayer(1).addEffect(EnumNodeEntitiesMessageType.PAINT, this.paint.bind(this));

        this.addEffect(EnumMessageType.RENDER, () => {
            this.draw();
        });
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
    }

    get viewport() {
        const obj = {
            tile: {
                x0: Number.isInteger(this.state.viewport.x) ? this.state.viewport.x : 0,
                y0: Number.isInteger(this.state.viewport.y) ? this.state.viewport.y : 0,
                x1: Number.isInteger(this.state.viewport.x) && Number.isInteger(this.state.viewport.width) ? this.state.viewport.x + this.state.viewport.width : this.node.tiles.width,
                y1: Number.isInteger(this.state.viewport.y) && Number.isInteger(this.state.viewport.height) ? this.state.viewport.y + this.state.viewport.height : this.node.tiles.height,
                width: Number.isInteger(this.state.viewport.width) ? this.state.viewport.width : this.node.tiles.width,
                height: Number.isInteger(this.state.viewport.height) ? this.state.viewport.height : this.node.tiles.height,
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

    draw() {
        for(let layer of this.stack) {
            layer.draw();
        }

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.resize(this.viewport.pixel.width, this.viewport.pixel.height);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.prop({ fillStyle: "#000" }).rect(0, 0, this.width, this.height, { isFilled: true });

        if(this.subject) {
            const comp = this.subject.getComponent(EnumComponentType.POSITION);
            const dw = ~~(this.viewport.pixel.width / this.scale / 2);
            const dh = ~~(this.viewport.pixel.height / this.scale / 2);

            this.paint(
                (comp.x * this.tw) - dw + (this.scale >= 1 ? this.tw / this.scale : 0),
                (comp.y * this.th) - dh + (this.scale >= 1 ? this.th / this.scale : 0),
                (this.viewport.pixel.width / this.scale),
                (this.viewport.pixel.height / this.scale),
                0,
                0,
                this.width,
                this.height,
            );
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
}