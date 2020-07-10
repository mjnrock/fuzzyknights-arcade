import View from "./View";
import GraphComponent from "./components/GraphComponent";
// import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
import Camera from "../render/Camera";

export default class GameView extends View {
    constructor(game, graph) {
        super(game);

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect(EnumKeyMessageType.KEY_MASK, graphComp.receive.bind(graphComp));

        this.camera = new Camera(graph.getNode(0, 0), {
            tw: 128,
            th: 128,
            scale: 1.0,

            //* Viewport Config
            x: 0,
            y: 0,
            w: 9,
            h: 9,

            subject: this.game.player,
        });
        this.camera.fps = 30;
        this.camera.getLayer(1).loadImage("raccoon", "./assets/entity/raccoon.png").then(() => {
            this.camera.play();

            setInterval(() => {

                // let i = 10000000000000,
                //     asc = true;
                // setInterval(() => {
                //     const inc = i * Math.sin(Math.PI);
                //     if(asc) {
                //         this.camera.scale += inc;
                //     } else {
                //         this.camera.scale -= inc;
                //     }
                //     if(this.camera.scale >= 3) {
                //         asc = false;
                //     } else if(this.camera.scale <= 0.25) {
                //         asc = true;
                //     }
                //     console.log(this.camera.scale)
                //     ++i;
    
                //     this.getGraph().tick();
                // }, 30);

                this.getGraph().tick();
            }, 30);
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