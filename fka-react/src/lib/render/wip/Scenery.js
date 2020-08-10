import GridCanvasNode from "../../hive/GridCanvasNode";

export default class Scenery extends GridCanvasNode {
    constructor(actors = [], { state = {}, config = {}, width, height, size } = {}) {
        super({ state, config, width, height, size });

        this.actors = new Set(actors);
    }

    has(actor) {
        return this.actors.has(actor);
    }
    register(actor) {
        this.actors.add(actor);

        return this;
    }
    unregister(actor) {
        this.actors.delete(actor);

        return this;
    }
    recast() {
        this.actors = new Set();

        return this;
    }
};