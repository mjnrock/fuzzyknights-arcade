import { v4 as uuidv4 } from "uuid";

export const EnumFacing = {
    TOP_DOWN: {
        0: [ "left", "right", "body", ],    //"ground", "head", "corona" ],
        45: [ "left", "right", "body", ],   //"ground", "head", "corona" ],
        90: [ "left", "body", "right", ],   //"ground", "head", "corona" ],
        135: [ "body", "left", "right", ],  //"ground", "head", "corona" ],
        180: [ "body", "left", "right", ],  //"ground", "head", "corona" ],
        225: [ "right", "body", "left", ],  //"ground", "head", "corona" ],
        270: [ "right", "body", "left", ],  //"ground", "head", "corona" ],
        315: [ "left", "right", "body", ],  //"ground", "head", "corona" ],
    }
};

export default class Composition {
    constructor(scores = [], { id } = {}) {
        this.id = id || uuidv4();

        this.scores = new Map(scores);
    }

    /**
     * 
     * @param {int} facing (degrees)
     * @param {int} elapsedTime (ms)
     * @returns [ { name, score, data: Score.get(@facing, @elapsedTime) }, ... ]
     */
    get(facing, elapsedTime, { lookup = EnumFacing.TOP_DOWN } = {}) {
        const arr = [ ...this.scores.entries() ];
        arr.sort(([ aname ], [ bname ]) => lookup[ facing ].indexOf(aname) - lookup[ facing ].indexOf(bname));

        return new Set(arr.map(([ name, score ]) => ({ name, score, data: score.get(facing, elapsedTime) })));
    }
    
    drawTo(canvas, { facing, elapsedTime, x, y, tx, ty }) {
        const scores = this.get(facing, elapsedTime);

        for(let { score, data } of [ ...scores.values() ]) {
            const [ sx, sy ] = data.position;

            if(sx !== void 0 && sy !== void 0) {
                const ctx = canvas.getContext("2d");

                if(tx !== void 0 && ty !== void 0) {
                    x = tx * score.data.tile.width;
                    y = ty * score.data.tile.height;
                }

                ctx.drawImage(
                    score.canvas,
                    sx,
                    sy,
                    score.data.tile.width,
                    score.data.tile.height,
                    x,
                    y,
                    score.data.tile.width,
                    score.data.tile.height
                );
            }
        }

        return canvas;
    }
};