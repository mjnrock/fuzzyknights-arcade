import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import { Bitwise } from "./../hive/Helper";
import Node from "./Node";
import { EnumMoveDirection } from "./../hive/KeyNode";

/*
 * This is meant to be the entire "level" in that dungeon game, or any space where "tessellated sub maps" is appropriate
 */

export const EnumEventType = {
    PLAYER_MOVEMENT_MASK: "PLAYER_MOVEMENT_MASK",
};

export default class Graph extends EventEmitter {
    constructor(game) {
        super();
        this.id = uuidv4();
        this.game = game;
        
        this.nodes = {};
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
        }

        return this;
    }
    removeNode(x, y) {
        const key = this._key(x, y);
        const node = this.nodes[ key ];

        if(node instanceof Node) {
            delete this.nodes[ key ];
        }

        return this;
    }

    neighbors(x, y) {
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



    onPlayerMovementMask(payload) {
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