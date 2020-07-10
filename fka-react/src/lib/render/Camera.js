import LayeredCanvasNode from "./../hive/LayeredCanvasNode";

import RenderNodeTerrain, { EnumMessageType as EnumNodeTerrainMessageType } from "./graph/Terrain.RenderNode";
import RenderNodeEntities, { EnumMessageType as EnumNodeEntitiesMessageType } from "./graph/Entities.RenderNode";

export default class Camera extends LayeredCanvasNode {
    constructor(node, { x, y, w, h, tw = 32, th = 32, size = [] } = {}) {
        super({
            state: {
                viewport: {
                    x,
                    y,
                    width: w,
                    height: h,
                },
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
    }

    get viewport() {
        return {
            x0: Number.isInteger(this.state.viewport.x) ? this.state.viewport.x : 0,
            y0: Number.isInteger(this.state.viewport.y) ? this.state.viewport.y : 0,
            x1: Number.isInteger(this.state.viewport.x) && Number.isInteger(this.state.viewport.width) ? this.state.viewport.x + this.state.viewport.width : this.width,
            y1: Number.isInteger(this.state.viewport.y) && Number.isInteger(this.state.viewport.height) ? this.state.viewport.y + this.state.viewport.height : this.height,
        };
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw() {
        for(let layer of this.stack) {
            console.log(this.viewport)
            layer.draw(
                this.viewport.x0,
                this.viewport.y0,
                this.viewport.x1,
                this.viewport.y1,
            );
        }


        this.paint();
    }
}