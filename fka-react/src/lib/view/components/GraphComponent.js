import Component from "./Component";

export default class GraphComponent extends Component {
    constructor(graph, { x, y, width = 1, height = 1 } = {}) {
        super({ x, y, width, height });

        this.graph = graph;
    }

    get() {
        return this.graph;
    }
    set(graph) {
        this.graph = graph;
    }

    receive(msg) {}
};