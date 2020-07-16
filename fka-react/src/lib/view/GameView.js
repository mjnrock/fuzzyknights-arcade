import { NormalizeTheta } from "./../hive/Helper";
import View from "./View";
import GraphComponent from "./components/GraphComponent";
import { EnumMessageType as EnumMouseMessageType } from "./../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../hive/KeyNode";
import Camera from "../render/Camera";
import EntityAction from "../entity/EntityAction";

import { EnumComponentType } from "./../entity/components/Component";
import Arc from "../model/Arc";

export default class GameView extends View {
    constructor(game, graph) {
        super(game);

        this.mouse.mergeConfig({
            moveRequiresButton: false,
        });

        const graphComp = new GraphComponent(graph);
        this.set("graph", graphComp);
        this.addEffect((state, msg) => {
            if(
                msg.type === EnumKeyMessageType.KEY_MASK
                || msg.type === EnumMouseMessageType.MOUSE_MOVE
            ) {
                graphComp.receive.call(graphComp, state, msg);
            }
        });

        this.bindKey(114, () => game.setting("isDebugMode", !game.setting("isDebugMode")));
        
        this.bindMouse(0, payload => {
            //  STUB
            const dx = payload.x - window.innerWidth / 2;
            const dy = payload.y - window.innerHeight / 2;
            const theta = NormalizeTheta(dx, dy);

            graph.getNode(0, 0).addEntity(new EntityAction({
                x: game.player.pos.x,
                y: game.player.pos.y,
                data: {
                    [ EnumComponentType.RIGID_BODY ]: {
                        facing: NormalizeTheta(dx, dy, { toNearestDegree: 45 }),
                        model: new Arc(64, game.player.pos.facing - 45 - 90, game.player.pos.facing + 45 - 90),
                        vx: 3.50 * Math.cos((theta - 90) / 180 * Math.PI),
                        vy: 3.50 * Math.sin((theta - 90) / 180 * Math.PI),
                    }
                }
            }));
        });

        this.camera = new Camera(game, graph.getNode(0, 0), {
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
                this.camera.onRender = dt => this.getGraph().tick(dt / 1000);
                
                this.camera.play();
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
        } else if(type === EnumKeyMessageType.KEY_PRESS) {
            this.dispatch(type, msg.payload);
        } else if(type === EnumMouseMessageType.MOUSE_MOVE) {
            this.dispatch(type, msg.payload);
        }
    }
}