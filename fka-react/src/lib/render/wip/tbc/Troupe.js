import { v4 as uuidv4 } from "uuid";

export default class Troupe {
    constructor(actors = [], { state = {}, config = {}, width, height, size, id } = {}) {
        super({ state, config, width, height, size });
        
        this.id = id || uuidv4();
        this.actors = new Set(actors);
    }

    has(actor) {
        return this.actors.has(actor);
    }
    join(actor) {
        this.actors.add(actor);

        return this;
    }
    leave(actor) {
        this.actors.delete(actor);

        return this;
    }
    recast() {
        this.actors = new Set();

        return this;
    }

    perform(...args) {
        const map = new Map();

        for(let actor of this.actors) {
            map.set(actor.entity, actor.perform(...args));
        }

        return map;
    }
};