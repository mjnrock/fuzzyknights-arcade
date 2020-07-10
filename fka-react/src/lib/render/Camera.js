import LayeredCanvasNode from "./../hive/LayeredCanvasNode";

import RenderNodeTerrain, { EnumMessageType as EnumNodeTerrainMessageType } from "./graph/Terrain.RenderNode";
import RenderNodeEntities, { EnumMessageType as EnumNodeEntitiesMessageType } from "./graph/Entities.RenderNode";

export default class Camera extends LayeredCanvasNode {
    constructor(node, { tw = 32, th = 32, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [                
                new RenderNodeTerrain(node, { tw, th, size }),
                new RenderNodeEntities(node, { tw, th, size }),
            ]
        });

        this.mergeState({
            node: node,
        });

        this.getLayer(0).addEffect(EnumNodeTerrainMessageType.PAINT, this.paint.bind(this));
        this.getLayer(1).addEffect(EnumNodeEntitiesMessageType.PAINT, this.paint.bind(this));
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

        this.paint();
    }
}