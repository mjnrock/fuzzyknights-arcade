import LayeredCanvasNode from "./../../hive/LayeredCanvasNode";

import NodeTerrain, { EnumEventType as EnumNodeTerrainEventType } from "./NodeTerrain";
import NodeEntities, { EnumEventType as EnumNodeEntitiesEventType } from "./NodeEntities";

export const EnumEventType = {
    UPDATE: "RenderNode.Update",
};

//TODO This is just a template, LayeredCanvasNode does not exist
export default class RenderNode extends LayeredCanvasNode {
    constructor(node, { tw = 32, th = 32, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [                
                new NodeTerrain(node, { tw, th, size }),
                new NodeEntities(node, { tw, th, size }),
            ]
        });

        this.mergeState({
            node: node,
        });

        this.getLayer(0).addEffect(EnumNodeTerrainEventType.UPDATE, this.paint.bind(this));
        this.getLayer(1).addEffect(EnumNodeEntitiesEventType.UPDATE, this.paint.bind(this));
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }
}