import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";
import EntityManager from "../entity/EntityManager";
import { EnumComponentType } from "../entity/components/Component";

/*
 * This is meant to be equivalent to a "room" in that dungeon game, or a "map" in the outer world
 * The tiles are meant to be the individual tiles for that map, as a tessellated grid
 */

export const EnumEventType = {
    ENTITY_JOIN: "ENTITY_JOIN",
    ENTITY_LEAVE: "ENTITY_LEAVE",
};

export default class Node extends EventEmitter {
    constructor({ entities = [], game } = {}) {
        super();
        this.id = uuidv4();
        this.game = game;
        
        this.portals = [];

        this.tiles = {
            width: 1,
            height: 1,
            "0.0": null,
        };

        this.entityManager = new EntityManager(game, this, entities);
    }

    occupants(x0, y0, x1, y1) {
        let ents = [];
        this.entities.forEach(entity => {
            const rb = entity.getComponent(EnumComponentType.RIGID_BODY);

            if(rb) {
                if(rb.x >= x0 && rb.x <= x1 && rb.y >= y0 && rb.y <= y1) {
                    ents.push(entity);
                }
            }
        });

        return ents;
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
                    fn(x, y, this.get(x, y));
                }
            }
        }
    }

    get(x, y) {
        const key = this._key(x, y);

        return this.tiles[ key ];
    }
    set(x, y, entry) {
        const key = this._key(x, y);

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

    toTileArray() {
        let arr = [],
            row = 0;
            
        Object.entries(this.tiles).forEach(([ key, tile ]) => {
            const split = key.split(".");
            
            if(split.length === 2) {
                const [ x, y ] = [ ~~split[ 0 ], ~~split[ 1 ] ];
            
                if(!Array.isArray(arr[ row ])) {
                    arr[ row ] = [];
                }
    
                arr[ row ].push([ x, y, tile ]);
                
                if(y === this.tiles.height - 1) {
                    row++;
                }
            }
        });
        
        return arr;
    }

    get size() {
        return [ this.tiles.width, this.tiles.height, this.tiles.width * this.tiles.height ];
    }
    get bounds() {
        return [ 0, 0, this.tiles.width - 1, this.tiles.height - 1 ];
    }

    get entities() {
        return this.entityManager.entities;
    }

    each(fn, offset = 0) {
        if(typeof fn === "function") {
            const entities = Array.from(this.entities.values());

            for(let i = offset; i < entities.length; i++) {
                fn(entities[ i ], i);
            }
        }
    }

    addEntity(entity) {
        this.entities.set(entity.id, entity);
        this.emit(EnumEventType.ENTITY_JOIN, entity);
        this.game.send("node", this, EnumEventType.ENTITY_JOIN, entity);
        
        return this;
    }
    removeEntity(entity) {
        this.entities.delete(entity.id);
        this.emit(EnumEventType.ENTITY_LEAVE, entity);
        this.game.send("node", this, EnumEventType.ENTITY_LEAVE, entity);
        
        return this;
    }

    addPortal(node, x, y) {
        this.portals.push({
            node,
            x,
            y,
        });
    }
    removePortal(node, x, y) {
        this.portals = this.portals.filter(portal => portal.node !== node && portal.x !== x && portal.y !== y);
    }

    tick(dt) {
        this.entityManager.tick(dt);
    }
};