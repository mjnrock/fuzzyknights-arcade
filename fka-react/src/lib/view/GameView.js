import View from "./View";
import GraphComponent from "./components/GraphComponent";
// import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";

export default class GameView extends View {
    constructor(graph) {
        super();

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect(EnumKeyMessageType.KEY_MASK, graphComp.receive.bind(graphComp));
    }

    getGraph() {
        return this.get("graph").get();
    }
    setGraph(graph) {
        return this.get("graph").set(graph);
    }

    receive(type, payload) {
        if(type === EnumKeyMessageType.KEY_MASK) {
            this.dispatch(type, {
                map: this.key.map,
                mask: payload
            });
        }
    }
}