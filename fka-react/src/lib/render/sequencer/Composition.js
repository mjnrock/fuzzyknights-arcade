import { v4 as uuidv4 } from "uuid";

export const Facing = {
    0: [ "right", "left", "body", "ground", "head", "corona" ],
    45: [ "right", "left", "body", "ground", "head", "corona" ],
    90: [ "right", "left", "body", "ground", "head", "corona" ],
    135: [ "right", "left", "body", "ground", "head", "corona" ],
    180: [ "left", "right", "body", "ground", "head", "corona" ],
    225: [ "left", "right", "body", "ground", "head", "corona" ],
    270: [ "left", "right", "body", "ground", "head", "corona" ],
    315: [ "left", "right", "body", "ground", "head", "corona" ],
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
    get(facing, elapsedTime) {
        const arr = [ ...this.scores.entries() ];
        arr.sort(([ aname ], [ bname ]) => Facing[ facing ].indexOf(aname) - Facing[ facing ].indexOf(bname));

        return arr.map(([ name, score ]) => ({ name, score, data: score.get(facing, elapsedTime) }));
    }
    
    drawTo(canvas, { facing, elapsedTime, x, y, tx, ty }) {
        const scores = this.get(facing, elapsedTime);

        for(let { score, data } of scores) {
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