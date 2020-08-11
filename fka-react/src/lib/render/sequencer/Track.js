import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import Base64 from "./../../util/Base64";
import Frame from "./Frame";

export const EnumEventType = {
    START: "Track.Start",
    STOP: "Track.Stop",
    NEXT: "Track.Next",
    PREVIOUS: "Track.Previous",
    MOVE: "Track.Reset",
}

export default class Track extends EventEmitter {
    constructor({ fps = 24, frames = [], tw = 128, th = 128 } = {}) {
        super();

        this.id = uuidv4();

        this.frames = new Map(frames);
        this._fps = fps;

        this.tile = {
            width: tw,
            height: th,
        };

        this.index = 0;
        this.timeout = null;
    }

    get spf() {
        return 1000 / this.fps;
    }

    get duration() {
        return [ ...this.frames.values() ].reduce((acc, frame) => acc + (frame.duration / this.fps), 0) * 1000;
    }

    get pixels() {
        return {
            width: this.frames.size * this.tile.width,
            height: this.tile.height,
        };
    }

    get fps() {
        return this._fps;
    }
    set fps(fps) {
        this.frames.forEach((frame) => {
            frame.duration = Math.min(frame.duration, fps);
        });

        this._fps = fps;
    }

    resize(tw = 128, th = 128) {
        this.tile.width = tw;
        this.tile.height = th;
    }

    get(index) {
        return [ ...this.frames.values() ][ index ];
    }

    get selected() {
        return this.get(this.index);
    }
    next() {
        this.index = this.index + 1 >= this.frames.size ? 0 : this.index + 1;

        this.emit(EnumEventType.NEXT, this.index);

        return this;
    }
    previous() {
        this.index = this.index - 1 >= 0 ? this.index - 1 : this.frames.size - 1;

        this.emit(EnumEventType.PREVIOUS, this.index);

        return this;
    }
    move(index = 0) {
        this.index = index;

        this.emit(EnumEventType.MOVE, this.index);

        return this;
    }
    start() {
        if(this.frames.size) {
            this.stop();
            this.timeout = setTimeout(() => {
                this.next();
                this.start();
            }, 1000 * (this.selected.duration / this.fps));
    
            this.emit(EnumEventType.START);
        }

        return this;
    }
    stop() {
        clearTimeout(this.timeout);
        this.timeout = null;

        this.emit(EnumEventType.STOP);

        return this;
    }

    add(input, duration) {
        if(input instanceof Frame) {
            this.frames.set(input.id, input);
        } else {
            Base64.Decode(input).then(canvas => {
                if(canvas instanceof HTMLCanvasElement) {
                    const frame = new Frame({
                        duration,
                        source: canvas.toDataURL(),
                    });

                    this.frames.set(frame.id, frame);
                }
            })
        }
        this.index = 0;

        return this;
    }
    remove(input) {
        this.frames.delete(input.id);
        this.index = 0;
    }

    reorder(index, newIndex) {
        let frames = [ ...this.frames.entries() ];
        const [ frame ] = frames.splice(index, 1) || [];

        if(frame) {
            frames.splice(newIndex, 0, frame);

            this.frames = new Map(frames);

            if(index === this.index) {
                this.index = newIndex;
            }
        }

        return this;
    }
    swap(i0, i1) {
        let frames = [ ...this.frames.entries() ];

        const f0 = frames[ i0 ];
        const f1 = frames[ i1 ];
        frames[ i0 ] = f1;
        frames[ i1 ] = f0;

        this.frames = new Map(frames);

        return this;
    }

    getFrameById(id) {
        return [ ...this.frames.values() ].reduce((a, frame) => (frame.id === id ? frame : null) || a);
    }

    sendToTrack(frame, track, index) {
        if(frame instanceof Frame && track instanceof Track) {
            this.remove(frame.id);
            track.add(frame);

            if(typeof index === "number") {
                track.reorder(track.frames.size - 1, index);
                this.index = 0;
            }
        }

        return this;
    }

    async toCanvas() {
        const proms = [];

        this.frames.forEach(frame => proms.push(frame.toCanvas()));

        const tabula = document.createElement("canvas");
        const ctx = tabula.getContext("2d");
        tabula.height = this.tile.height;
        tabula.width = this.tile.width * this.frames.size;
        
        return Promise.all(proms).then(canvases => {
            canvases.forEach((canvas, i) => {
                ctx.drawImage(canvas, this.tile.width * i, 0);
            });

            return tabula;
        });
    }

    async toData() {
        return new Promise((resolve, reject) => {
            Promise.all([ ...this.frames.values() ].map(async frame => {
                return await frame.toData();
            })).then(frames => {    
                const data = {
                    id: this.id,
                    fps: this.fps,
                    tile: this.tile,
                    duration: this.duration,
                    frames,
                };

                resolve(data);
            });
        });
    }
};