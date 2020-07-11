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
        this.addEffect((state, msg) => msg.type === EnumKeyMessageType.KEY_MASK ? graphComp.receive.call(graphComp, state, msg) : null);

        this.camera = new Camera(graph.getNode(0, 0), {
            tw: 128,
            th: 128,
            scale: 1.0,

            //* Viewport Config
            x: 0,
            y: 0,
            w: 9,
            h: 7,

            subject: this.game.player,
        });

        this.camera.getLayer(0).loadImages([
            [ "terrain.grass", "./assets/terrain/grass.png" ],
            [ "terrain.dirt", "./assets/terrain/dirt.png" ],
            [ "terrain.stone", "./assets/terrain/stone.png" ],
        ]).then(() => {
            this.camera.getLayer(1).loadImages([
                [ "entity.raccoon", "./assets/entity/raccoon.png" ],
                [ "entity.beaver", "./assets/entity/beaver.png" ],
                [ "entity.rabbit", "./assets/entity/rabbit.png" ],
                [ "entity.walrus", "./assets/entity/walrus.png" ],
                [ "entity.bull", "./assets/entity/bull.png" ],
            ]).then(() => {
                this.camera.getLayer(0).draw();
                this.camera.play();
    
                setInterval(() => this.getGraph().tick(), 1000 / 60);
            });  
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