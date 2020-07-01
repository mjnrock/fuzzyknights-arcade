import GridCanvasNode from "./hive/GridCanvasNode";

import { EnumTerrainType } from "./Terrain";

export default class RenderNode extends GridCanvasNode {
    constructor(node, { tw = 32, th = 32, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            node: node,
        });

        this.canvas.onmousedown = e => {
            console.log(e.x, e.y)
        }
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw() {
        this.node.apply((x, y, tile) => {
            const terrain = tile.terrain;

            if(terrain.type === EnumTerrainType.FLOOR) {
                this.prop({
                    fillStyle: "#999",
                }).gPoint(x, y);
            } else if(terrain.type === EnumTerrainType.WALL) {
                this.prop({
                    fillStyle: "#555",
                }).gPoint(x, y);
            } else {
                this.prop({
                    fillStyle: "#000",
                }).gPoint(x, y);
            }
        })
    }
}