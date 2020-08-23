import Registry from "./../util/Registry";
import Game from "./../Game";
import GameView, { Controls as GameViewControls } from "./GameView";
import Camera from "./../render/Camera";
import TitleView from "./TitleView";

export default class ViewManager extends Registry {
    constructor() {
        super();
        
        this.create({
            key: "GameView",
            value:  () => new GameView(Game.$.graph, {
                camera: new Camera(Game.$.graph.getNode(0, 0), {
                    tw: 128,
                    th: 128,
                    scale: 1.0,     //TODO Scale no longer affects the rendered image, only the DOM canvas size
            
                    //* Viewport Config
                    x: 0,   // Only relevant w/o a subject
                    y: 0,   // Only relevant w/o a subject
                    w: 9,
                    h: 7,
            
                    subject: Game.$.player,
                }),
                controls: GameViewControls
            })
        });
        this.create({
            key: "TitleView",
            value:  () => new TitleView(),
        });

        this._current = this.use("TitleView");
    }

    get current() {
        return this._current;
    }
    set current(current) {
        this._current = current;
    }

    use(key) {
        const current = this.get(key);

        if(current) {
            this._current = current();
        }

        return this._current;
    }

    start() {
        this.use("GameView");
        Game.$.start();
    }
    stop() {
        Game.$.stop();
    }
}