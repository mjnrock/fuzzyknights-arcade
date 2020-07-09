import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Bitwise } from "./../hive/Helper";

import Node from "./Node";
import { EnumMoveDirection } from "./../hive/KeyNode";

/*
 * This is meant to be the entire "level" in that dungeon game, or any space where "tessellated sub maps" is appropriate
 */

export const EnumEventType = {
    PLAYER_MOVE: "PLAYER_MOVE",
    ENTITY_MOVE: "ENTITY_MOVE",
};

export default class Graph extends EventEmitter {
    constructor() {
        super();
        this.id = uuidv4();
        
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

    toNodeArray() {
        let arr = [],
            row = 0;
            
        Object.entries(this.nodes).forEach(([ key, node ]) => {
            const split = key.split(".");
            
            if(split.length === 2) {
                const [ x, y ] = [ ~~split[ 0 ], ~~split[ 1 ] ];
            
                if(!Array.isArray(arr[ row ])) {
                    arr[ row ] = [];
                }
    
                arr[ row ].push([ x, y, node ]);
                
                if(y === this.tiles.height - 1) {
                    row++;
                }
            }
        });
        
        return arr;
    }

    onPlayerMove(payload) {
        const { map, mask } = payload;

        if(Bitwise.has(mask, map[ EnumMoveDirection.UP ])) {
                
        } else {

        }

        if(Bitwise.has(mask, map[ EnumMoveDirection.DOWN ])) {

        } else {

        }

        if(Bitwise.has(mask, map[ EnumMoveDirection.LEFT ])) {

        } else {

        }

        if(Bitwise.has(mask, map[ EnumMoveDirection.RIGHT ])) {

        } else {

        }

        console.log(mask, map);
    }
};