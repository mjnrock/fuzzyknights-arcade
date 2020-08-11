import Layer from "./Layer";

export default class Camera {
    constructor({ subject, graph, layers = [] } = {}) {
        this.layers = new Set(layers);
        this.graph = graph;
        this.subject = subject;
    }
};