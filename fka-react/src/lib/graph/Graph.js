import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Node from "./Node";

import Tile from "./Tile";
import Terrain, { EnumTerrainType } from "./Terrain";

/*
 * This is meant to be the entire "level", or any space where "tessellated sub maps" are appropriate.
 * As such, a world map would be a Graph with 1 or more Nodes; a dungeon would be another Graph with 1 or more Nodes; etc.
 */

export class GraphFactory {
    static Generate(gw, gh, nw, nh) {
        const graph = new Graph();

        for(let w = 0; w < gw; w++) {
            for(let h = 0; h < gh; h++) {
                const node = new Node();

                node.seed(nw, nh, function(x, y) {
                    let tile;

                    if(
                        (x === 0 && y === Math.floor(nh / 2))
                        || (x === nw - 1 && y === Math.floor(nh / 2))
                        || (x === Math.floor(nw / 2) && y === 0)
                        || (x === Math.floor(nw / 2) && y === nh - 1)
                    ) {
                        tile = new Tile(
                            new Terrain(EnumTerrainType.DOOR), {
                            isNavigable: true,
                            isInteractable: true,
                        });
                    } else if(this.isEdge(x, y)) {
                        tile = new Tile(
                            new Terrain(EnumTerrainType.WALL), {
                            isNavigable: false
                        });
                    } else {
                        tile = new Tile(
                            new Terrain(EnumTerrainType.FLOOR), {
                            isNavigable: true
                        });
                    }

                    return tile;
                });

                graph.addNode(w, h, node);
            }
        }

        return graph;
    }
};

export default class Graph extends EventEmitter {
    static get Factory() {
        return GraphFactory;
    }

    constructor() {
        super();
        this.id = uuidv4();
        
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

    // addPortal(n0, x0, y0, n1, x1, y1, { twoWay = false, rx, ry } = {}) {
    addPortal(n0, x0, y0, n1, x1, y1) {
        if(Array.isArray(n0) && n0.length === 2) {
            n0 = this.getNode(...n0);
        }
        if(Array.isArray(n1) && n1.length === 2) {
            n1 = this.getNode(...n1);
        }

        if(n0 instanceof Node && n1 instanceof Node) {
            n0.addPortal(x0, y0, n1, x1, y1);

            //  TODO Make this kind of thing possible, without creating infinite loops (e.g. interaction activation, offset, etc.)
            // if(twoWay === true) {
            //     n1.addPortal(x1, y1, n0, x0, y0);
            // } else if(typeof rx === "number" && typeof ry === "number") {
            //     n1.addPortal(rx, ry, n0, x0, y0);
            // }
        }
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

    tick(dt, now) {
        for(let node of Object.values(this.nodes)) {
            node.tick(dt, now);
        }
    }
};