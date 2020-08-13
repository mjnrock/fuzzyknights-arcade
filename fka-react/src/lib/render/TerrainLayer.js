import GridCanvasNode from "../hive/GridCanvasNode";
import { EnumTerrainType } from "../graph/Terrain";

export default class TerrainLayer extends GridCanvasNode {
    constructor(book, { width, height, tw = 128, th = 128, size = [] } = {}) {
        super({
            width: width,
            height: height,
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            book: book,
            lastDraw: null,
        });

        this.loadImages([
            [ "terrain-grass-1", "./assets/terrain/grass-128-1.png"],
            [ "terrain-grass-2", "./assets/terrain/grass-128-2.png"],
        ]);
        
        //  Isometric Transformation
        // this.ctx.translate(this.width / 2, 0);   // This sets "where" the canvas origin is (in this case, the rotation point)
        //  // this.ctx.scale(1, 0.5);  //  Not scaling the entities makes an interesting effect
        // this.ctx.rotate(45 * Math.PI /180);
    }

    get book() {
        return this.state.book;
    }
    set book(value) {
        this.state.book = value;
    }

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, node, game } = {}) {
        if(!this.state.lastDraw) {
            console.log(1)
            this.ctx.clearRect(0, 0, this.width, this.height);

            this.ctx.save();
            this.ctx.scale(scale, scale);
            node.apply((tx, ty, tile) => {
                // if(tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
                    const terrain = tile.terrain;
        
                    //  STUB
                    if(terrain.type === EnumTerrainType.FLOOR) {
                        if(this.img("terrain-grass-1")) {
                            if((~~tx + ~~ty) % 2 === 0) {
                                this.gTile("terrain-grass-1", 0, 0, tx, ty);
                            } else {
                                this.gTile("terrain-grass-2", 0, 0, tx, ty);
                            }

                            this.state.lastDraw = Date.now();
                        } else {
                            this.prop({ fillStyle: "#7bb080" }).gRect(tx, ty, 1, 1, { isFilled: true });
                        }
                    } else if(terrain.type === EnumTerrainType.WALL) {
                        this.prop({ fillStyle: "grey" }).gRect(tx, ty, 1, 1, { isFilled: true });
                    } else if(terrain.type === EnumTerrainType.DOOR) {
                        this.prop({ fillStyle: "#444" }).gRect(tx, ty, 1, 1, { isFilled: true });
                    } else {
                        this.prop({
                            fillStyle: "#000",
                            strokeStyle: "#000",
                        }).gPoint(tx, ty);
                    }
                // }
            });
            this.ctx.restore();
        }
    }
}