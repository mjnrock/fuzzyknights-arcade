import GridCanvasNode from "../../hive/GridCanvasNode";

import { EnumTerrainType } from "../../graph/Terrain";

export const EnumMessageType = {
    PAINT: "NodeTerrain.Paint",
};

export default class RenderNodeTerrain extends GridCanvasNode {
    constructor(node, { tw = 32, th = 32, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            node: node,
        });

        // //? This is meant to bind event handlers of this canvas to the React ref canvases
        // //FIXME Temp event association until Base64 class is modified to accommodate
        // this.canvas.onmousedown = e => {
        //     console.log(e.x, e.y)
        // }

        this.draw();
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw(x, y, w, h) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.node.apply((tx, ty, tile) => {
            if(tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
                const terrain = tile.terrain;
    
                if(terrain.type === EnumTerrainType.FLOOR) {
                    this.prop({
                        fillStyle: "#999",
                    }).gPoint(tx, ty);
                } else if(terrain.type === EnumTerrainType.WALL) {
                    this.prop({
                        fillStyle: "#555",
                    }).gPoint(tx, ty);
                } else if(terrain.type === EnumTerrainType.DOOR) {
                    this.prop({
                        fillStyle: "#222",
                    }).gPoint(tx, ty);
                } else {
                    this.prop({
                        fillStyle: "#000",
                    }).gPoint(tx, ty);
                }
            }
        });
        

        this.dispatch(EnumMessageType.PAINT);
    }
}