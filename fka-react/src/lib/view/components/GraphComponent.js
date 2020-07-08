import Component from "./Component";

export default class GraphComponent extends Component {
    constructor(graph, { width = 1, height = 1 } = {}) {
        super({ width, height });

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