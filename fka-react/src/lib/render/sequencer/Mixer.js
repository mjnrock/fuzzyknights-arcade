import { v4 as uuidv4 } from "uuid";
import Track from "./Track";

export default class Mixer {
    constructor({ tracks = [] } = {}) {
        this.id = uuidv4();

        this.tracks = new Map(tracks);
    }

    get pixels() {
        let width = 0,
            height = 0,
            trackWidth = 0,
            trackHeight = 0;

        this.tracks.each(track => {
            width = Math.max(width, track.pixels.width);
            height += track.pixels.height;

            trackWidth = Math.max(track.pixels.width, trackWidth);
            trackHeight = Math.max(track.pixels.height, trackHeight);
        });

        return {
            width,
            height,
            
            track: {
                width: trackWidth,
                height: trackHeight,
            }
        };
    }

    newTrack({ fps, frames = [], tw = 128, th = 128 } = {}) {
        const track = new Track({ fps, frames, tw, th });

        this.add(track);

        return track;
    }

    get(index) {
        return [ ...this.tracks.values() ][ index ];
    }

    add(track) {
        if(track instanceof Track) {
            this.tracks.set(track.id, track);
        }

        return this;
    }
    remove(track) {
        this.tracks.delete(track.id);

        return this;
    }

    reorder(index, newIndex) {
        let tracks = [ ...this.tracks.entries() ];
        const [ track ] = tracks.splice(index, 1) || [];

        if(track) {
            tracks.splice(newIndex, 0, track);

            this.tracks = new Map(tracks);
        }

        return this;
    }
    swap(i0, i1) {
        let tracks = [ ...this.tracks.entries() ];

        const t0 = tracks[ i0 ];
        const t1 = tracks[ i1 ];
        tracks[ i0 ] = t1;
        tracks[ i1 ] = t0;

        this.tracks = new Map(tracks);

        return this;
    }

    getTrackById(id) {
        return [ ...this.tracks.values() ].reduce((a, track) => (track.id === id ? track : null) || a);
    }

    async toCanvas() {
        const meta = {
            width: 0,
            height: 0,
        };
        
        return Promise.all([ ...this.tracks.values() ].map(async track => {
            const canvas = await track.toCanvas();

            meta.width = Math.max(meta.width, canvas.width);
            meta.height = Math.max(meta.height, canvas.height);

            return [ track, canvas ];
        })).then(canvases => {
            const tabula = document.createElement("canvas");
            const ctx = tabula.getContext("2d");
            tabula.height = meta.height * this.tracks.size;
            tabula.width = meta.width;

            canvases.forEach(([ track, canvas ], i) => {
                ctx.drawImage(canvas, 0, meta.height * i);
            });

            return tabula;
        });
    }

    async toData() {
        return new Promise((resolve, reject) => {
            let totalLength = 0;
            Promise.all([ ...this.tracks.values() ].map(async track => {
                const trackData = await track.toData();

                totalLength = Math.max(trackData.duration, totalLength);

                return trackData;
            })).then(tracks => {    
                const data = {
                    id: this.id,
                    duration: totalLength,
                    tile: {
                        width: tracks[ 0 ].tile.width,
                        height: tracks[ 0 ].tile.height,
                    },
                    tracks,
                };

                resolve(data);
            });
        });
    }
}