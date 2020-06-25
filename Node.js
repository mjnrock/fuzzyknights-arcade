import EventEmitter from "events";
import Tile from "./Tile";

/*
 * This is meant to be equivalent to a "room" in that dungeon game, or a "map" in the outer world
 * The tiles are meant to be the individual tiles for that map, as a tessellated grid
 */

export const EnumEventType = {};

export default class Node extends EventEmitter {
    constructor() {
        super();
        
        this.portals = {
            north: null,
            east: null,
            south: null,
            west: null,
            spawn: null,
        };

        this.tiles = {
            width: 1,
            height: 1,
            "0.0": null,
        };

        this.positions = new WeakMap(); // Keeps a weak reference to position, with entry as key
    }

    _key(x, y) {
        return `${ x }.${ y }`;
    }

    isEdge(x, y) {
        const [ xmin, ymin, xmax, ymax ] = this.bounds;

        return x === xmin
            || x === xmax
            || y === ymin
            || y === ymax;
    }

    seed(width, height, fn) {
        this.tiles.width = width;
        this.tiles.height = height;

        for(let x = 0; x < this.tiles.width; x++) {
            for(let y = 0; y < this.tiles.height; y++) {
                const key = this._key(x, y);

                if(typeof fn === "function") {
                    const entry = fn.call(this, x, y);

                    this.tiles[ key ] = entry;

                    if(entry) {
                        this.positions.set(entry, key);
                    }
                } else {
                    this.tiles[ key ] = null;
                }
            }
        }
    }

    apply(fn) {
        if(typeof fn === "function") {
            const [ x0, y0, x1, y1 ] = this.bounds;

            for(let x = x0; x <= x1; x++) {
                for(let y = y0; y <= y1; y++) {
                    fn(this.get(x, y));
                }
            }
        }
    }

    pos(entry) {
        const key = this.positions.get(entry);

        if(key) {
            const pos = key.split(".");

            return [
                ~~pos[ 0 ],
                ~~pos[ 1 ],
            ];
        }
    }

    get(x, y) {
        const key = this._key(x, y);

        return this.tiles[ key ];
    }
    set(x, y, entry) {
        const key = this._key(x, y);

        this.positions.set(entry, key);
        this.tiles[ key ] = entry;

        return this;
    }
    swap(x0, y0, x1, y1) {
        const key0 = this._key(x0, y0);
        const key1 = this._key(x1, y1);
        const entry0 = this.tiles[ key0 ];
        const entry1 = this.tiles[ key1 ];

        this.set(x0, y0, entry1);
        this.set(x1, y1, entry0);
    }

    neighbors(x, y) {
        if(x instanceof Tile) {
            const key = this.positions.get(x);
            const split = key.split(".");

            if(split.length === 2) {
                x = ~~split[ 0 ];
                y = ~~split[ 1 ];
            }
        }

        return {
            north: this.tiles[ this._key(x, y - 1) ],
            east: this.tiles[ this._key(x + 1, y) ],
            south: this.tiles[ this._key(x, y + 1) ],
            west: this.tiles[ this._key(x - 1, y) ],
            
            northeast: this.tiles[ this._key(x + 1, y - 1) ],
            northwest: this.tiles[ this._key(x - 1, y - 1) ],
            southeast: this.tiles[ this._key(x + 1, y + 1) ],
            southwest: this.tiles[ this._key(x - 1, y + 1) ],
        };
    }

    get size() {
        return [ this.tiles.width, this.tiles.height, this.tiles.width * this.tiles.height ];
    }
    get bounds() {
        return [ 0, 0, this.tiles.width - 1, this.tiles.height - 1 ];
    }
    
    get has() {
        return {
            north: this.portals.north instanceof Node,
            east: this.portals.east instanceof Node,
            south: this.portals.south instanceof Node,
            west: this.portals.west instanceof Node,
        };
    }
};