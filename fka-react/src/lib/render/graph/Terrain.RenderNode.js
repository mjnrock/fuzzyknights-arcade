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

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, game } = {}) {
        this.clear();

        this.ctx.save();
        this.ctx.scale(scale, scale);
        this.node.apply((tx, ty, tile) => {
            if(tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
                const terrain = tile.terrain;
    
                if(terrain.type === EnumTerrainType.FLOOR) {
                    if(this.img("terrain.grass")) {
                        this.gTile(this.img("terrain.grass"), 0, 0, tx, ty);
                    }
                } else if(terrain.type === EnumTerrainType.WALL) {
                    if(this.img("terrain.stone")) {
                        this.gTile(this.img("terrain.stone"), 0, 0, tx, ty);
                    }
                } else if(terrain.type === EnumTerrainType.DOOR) {
                    if(this.img("terrain.dirt")) {
                        this.gTile(this.img("terrain.dirt"), 0, 0, tx, ty);
                    }
                } else {
                    this.prop({
                        fillStyle: "#000",
                        strokeStyle: "#000",
                    }).gPoint(tx, ty);
                }

                //STUB
                // if(game && game.setting("isDebugMode")) {
                if(true) {
                    this.prop({
                        strokeStyle: "#0f0",
                    }).gRect(tx, ty, this.tw, this.th);
                }
            }
        });
        this.ctx.restore();        

        this.dispatch(EnumMessageType.PAINT);
    }
}