import EventEmitter from "events";

/*
 * This is meant to be the entire "level" in that dungeon game, or any space where "tessellated sub maps" is appropriate
 */

export const EnumEventType = {};

export default class Graph extends EventEmitter {
    constructor() {
        super();
        
        this.nodes = [];
        this.edges = [];
    }
};