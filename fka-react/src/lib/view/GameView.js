import View from "./View";
import GraphComponent from "./components/GraphComponent";

export default class GameView extends View {
    constructor(graph) {
        super();

        this.set("graph", new GraphComponent(graph));
    }

    getGraph() {
        return this.get("graph").component.get();
    }
    setGraph(graph) {
        return this.get("graph").component.set(graph);
    }
}