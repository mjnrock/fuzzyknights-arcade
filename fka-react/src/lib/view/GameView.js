import View from "./View";
import GraphComponent from "./components/GraphComponent";
// import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
import Camera from "../render/Camera";

export default class GameView extends View {
    constructor(graph) {
        super();

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect(EnumKeyMessageType.KEY_MASK, graphComp.receive.bind(graphComp));

        this.camera = new Camera(graph.getNode(0, 0), {
            tw: 128,
            th: 128,

            x: 0,
            y: 0,
            w: 9,
            h: 8,
        });
        this.camera.getLayer(1).loadImage("raccoon", "./assets/entity/raccoon.png").then(() => {
            this.camera.node.addEntity(1);
            this.camera.draw();
        });        
    }

    getGraph() {
        return this.get("graph").get();
    }
    setGraph(graph) {
        return this.get("graph").set(graph);
    }

    receive(type, payload, msg) {
        if(type === EnumKeyMessageType.KEY_MASK) {
            this.dispatch(type, {
                map: this.key.map,
                mask: payload
            });
        }
    }
}