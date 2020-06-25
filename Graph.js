import EventEmitter from "events";
import Node from "./Node";

/*
 * This is meant to be the entire "level" in that dungeon game, or any space where "tessellated sub maps" is appropriate
 */

export const EnumEventType = {};

export default class Graph extends EventEmitter {
    constructor() {
        super();
        
        this.nodes = {};

        this.positions = new WeakMap(); // Keeps a weak reference to position, with entry as key
    }

    _key(x, y) {
        return `${ x }.${ y }`;
    }

    getNode(x, y) {
        return this.nodes[ this._key(x, y) ];
    }

    addNode(x, y, node) {
        if(node instanceof Node) {
            const key = this._key(x, y);

            this.nodes[ key ] = node;
            this.positions.set(node, key);
        }

        return this;
    }
    removeNode(x, y) {
        const key = this._key(x, y);
        const node = this.nodes[ key ];

        if(node instanceof Node) {
            delete this.nodes[ key ];
            this.positions.delete(key);
        }

        return this;
    }

    neighbors(x, y) {
        if(x instanceof Node) {
            const key = this.positions.get(x);
            const split = key.split(".");

            if(split.length === 2) {
                x = ~~split[ 0 ];
                y = ~~split[ 1 ];
            }
        }

        return {
            north: this.nodes[ this._key(x, y - 1) ],
            east: this.nodes[ this._key(x + 1, y) ],
            south: this.nodes[ this._key(x, y + 1) ],
            west: this.nodes[ this._key(x - 1, y) ],
            
            northeast: this.nodes[ this._key(x + 1, y - 1) ],
            northwest: this.nodes[ this._key(x - 1, y - 1) ],
            southeast: this.nodes[ this._key(x + 1, y + 1) ],
            southwest: this.nodes[ this._key(x - 1, y + 1) ],
        };
    }
};