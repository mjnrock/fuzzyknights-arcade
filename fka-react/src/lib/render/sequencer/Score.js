import { v4 as uuidv4 } from "uuid";
import Base64 from "./../../util/Base64";
import Mixer from "./Mixer";

//TODO Create helper functions to perform hash lookups and facing lookups that would be stored in this.data
//TODO Create accessor methods for the "current frame" and things like Elapsable (maybe make a "generator" that passes with a reference to the Score, so that multiple Elapsables can reference a single Score)

export default class Score {
    constructor(mixer, { weight = 1, canvas, bounds = {}, data = {}, id } = {}) {
        this.id = id || uuidv4();
        
        this.weight = weight;
        this.bounds = bounds;
        this.data = data;

        if(canvas instanceof HTMLCanvasElement) {
            this.canvas = canvas;
        } else if(mixer instanceof Mixer) {
            mixer.toCanvas().then(canvas => this.canvas = canvas);
        }

        if(mixer instanceof Mixer && Object.keys(data).length) {            
            mixer.toData().then(data => this.data = data);
        }
    }

    get canvas() {
        if("x0" in this.bounds && "y0" in this.bounds && "x1" in this.bounds && "y1" in this.bounds) {
            return this._canvas.getImage(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        }

        return this._canvas;
    }
    set canvas(canvas) {
        this._canvas = canvas;
    }
    
    setBounds(x, y, w, h) {
        this.bounds = {
            x: x !== void 0 ? x : this.bounds.x,
            y: y !== void 0 ? y : this.bounds.y,
            w: w !== void 0 ? w : this.bounds.w,
            h: h !== void 0 ? h : this.bounds.h,
        };

        return this;
    }

    static async Create(mixer, opts = {}) {
        if(mixer instanceof Mixer) {
            const score = new Score(null, opts);

            return mixer.toCanvas().then(canvas => {
                score.canvas = opts.canvas || canvas;

                return score;
            });
        }
    }

    get(facing, elapsedTime) {
        elapsedTime = elapsedTime % this.data.duration;
        
        const theta = Math.round(facing / this.data.step) * this.data.step;
        const track = this.data.direction.get(theta);

        let hash;
        for(let [ threshold, frame ] of track.frames) {            
            if(elapsedTime < threshold) {
                hash = frame.hash;
                break;
            }
        }

        const [ tx, ty ] = this.data.frames.get(hash);
        return {
            hash,
            position: [ tx * this.data.tile.width, ty * this.data.tile.height ],
        };
    }
    
    drawTo(canvas, { facing, elapsedTime, x, y, tx, ty }) {
        const { position: [ sx, sy ] } = this.get(facing, elapsedTime) || {};

        if(sx !== void 0 && sy !== void 0) {
            const ctx = canvas.getContext("2d");

            if(tx !== void 0 && ty !== void 0) {
                x = tx * this.data.tile.width;
                y = ty * this.data.tile.height;
            }

            ctx.drawImage(
                this.canvas,
                sx,
                sy,
                this.data.tile.width,
                this.data.tile.height,
                x,
                y,
                this.data.tile.width,
                this.data.tile.height
            );
        }

        return canvas;
    }


    toImage(type = "image/png", quality = 1.0) {
        return this.canvas.toDataURL(type, quality);
    }
    toDataURL(...args) {
        return this.canvas.toDataURL(...args);
    }


    serialize() {
        const source = this.toImage();

        return JSON.stringify({
            id: this.id,
            weight: this.weight,
            bounds: this.bounds,
            data: {
                ...this.data,
                
                frames: [ ...this.data.frames.entries() ],
                direction: [ ...this.data.direction.entries() ],
            },
            source: source,
        });
    }
    static async Deserialize(json) {
        return new Promise((resolve, reject) => {
            let obj = json;
    
            while(typeof obj === "string" || obj instanceof String) {
                obj = JSON.parse(obj);
            }
    
            const score = new Score(null, {
                id: obj.id,
                weight: obj.weight,
                bounds: obj.bounds,
                data: {
                    ...obj.data,

                    frames: new Map(obj.data.frames),
                    direction: new Map(obj.data.direction),
                },
            });
    
            return Base64.Decode(obj.source).then(canvas => {
                if(canvas instanceof HTMLCanvasElement) {                
                    score.canvas = canvas;

                    resolve(score);
                } else {
                    reject("@json.source is not a valid Base64 image");
                }

                return score;
            });
        });
    }
};