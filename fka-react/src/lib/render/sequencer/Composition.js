import { v4 as uuidv4 } from "uuid";
import { GAME_TILE_SIZE } from "./Score";

export const EnumFacing = {
    TOP_DOWN: {
        0: [ "right", "left", "body", ],    //"ground", "shadow", "head", "corona" ],
        45: [ "left", "right", "body", ],   //"ground", "shadow", "head", "corona" ],
        90: [ "left", "body", "right", ],   //"ground", "shadow", "head", "corona" ],
        135: [ "body", "left", "right", ],  //"ground", "shadow", "head", "corona" ],
        180: [ "body", "left", "right", ],  //"ground", "shadow", "head", "corona" ],
        225: [ "body", "right", "left", ],  //"ground", "shadow", "head", "corona" ],
        270: [ "right", "body", "left", ],  //"ground", "shadow", "head", "corona" ],
        315: [ "right", "left", "body", ],  //"ground", "shadow", "head", "corona" ],
    },
};

export default class Composition {
    constructor(scores = [], { id } = {}) {
        this.id = id || uuidv4();

        this.scores = new Map(scores);

        // this.config = {
        //     shouldRepeat: true,
        // };
    }

    // toggle(key) {
    //     if(key in this.config) {
    //         this.config[ key ] = !this.config[ key ];
    //     }

    //     return this;
    // }
    // turnOn(key) {
    //     if(key in this.config) {
    //         this.config[ key ] = true;
    //     }

    //     return this;
    // }
    // turnOff(key) {
    //     if(key in this.config) {
    //         this.config[ key ] = false;
    //     }

    //     return this;
    // }

    /**
     * @param {int} facing (degrees)
     * @param {int} elapsedTime (ms)
     * @returns [ { name, score, data: Score.get(@facing, @elapsedTime) }, ... ]
     */
    get(facing, elapsedTime, { lookup = EnumFacing.TOP_DOWN } = {}) {
        return lookup[ facing ].reduce((arr, name) => {
            const score = this.scores.get(name);

            if(score) {     // Score might not exist (e.g. "corona", "ground", etc.)
                arr.push({
                    name,
                    score,
                    data: score.get(facing, elapsedTime)
                });
            }

            return arr;
        }, []);
    }
    
    drawTo(canvas, { ignore = [], facing, elapsedTime, x, y, tx, ty, tw, th }) {
        const scores = this.get(facing, elapsedTime);

        for(let { name, score, data } of scores) {
            if(!ignore.includes(name)) {
                const [ sx, sy ] = data.position;
    
                if(sx !== void 0 && sy !== void 0) {
                    const ctx = canvas.getContext("2d");
    
                    if(tx !== void 0 && ty !== void 0) {
                        x = tx * (tw || GAME_TILE_SIZE.WIDTH);
                        y = ty * (th || GAME_TILE_SIZE.HEIGHT);
                    }
                    
                    ctx.drawImage(
                        score.canvas,
                        sx,
                        sy,
                        score.data.tile.width,
                        score.data.tile.height,
                        x - score.data.tile.width / 2,
                        y - score.data.tile.height / 2,
                        score.data.tile.width,
                        score.data.tile.height
                    );
                }
            }
        }

        return canvas;
    }
};