import View from "./View";
import GraphComponent from "./components/GraphComponent";

export default class GameView extends View {
    constructor(graph) {
        super({ cols: 1, rows: 1 });

        this.set(0, 0, new GraphComponent(graph));
    }

    getGraph() {
        return this.get(0, 0).component.get();
    }
    setGraph(graph) {
        return this.get(0, 0).component.set(graph);
    }
}