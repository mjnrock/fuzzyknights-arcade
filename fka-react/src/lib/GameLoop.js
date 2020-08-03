import MainLoop from "mainloop.js";

export default class GameLoop {
    constructor(game, fps = 30) {
        this.game = game;
        this._fps = fps;

        this.loop = MainLoop.setBegin(this.pre.bind(this))
            .setUpdate(this.update.bind(this))
            .setDraw(this.draw.bind(this))
            .setEnd(this.post.bind(this))
            .setSimulationTimestep(this.spf);
    }

    get fps() {
        return this._fps;
    }
    set fps(fps) {
        this._fps = fps;

        if(this.isRunning === true) {
            this.stop();
            this.start();
        }
    }
    get spf() {
        return 1000 / this.fps;
    }

    start() {
        this.loop.start();

        return this;
    }
    stop() {
        

        return this;
    }

    /**
     * @param {number} ts Total elapsed time
     * @param {number} dt Frame delta in ms
     */
    pre(ts, dt) {}

    /**
     * @param {number} dt Frame delta in ms
     */
    //TODO GameView has a camera reference, but all Cameras and rendering should be held by a higher structure (e.g. a grand View/Render Manager)
    update(dt) {
        this.game.graph.tick(dt / 1000);
    }

    /**
     * @param {number} interpolationPercentage A factor between 0.0 and 1.0, used as a scaling weight similar to delta time
     */
    draw(interpolationPercentage) {
        // console.log("%", interpolationPercentage);
    }

    post(fps, panic) {
        if (panic) {
            let discardedTime = Math.round(MainLoop.resetFrameDelta());
            console.warn("Main loop panicked, probably because the browser tab was put in the background. Discarding ", discardedTime, "ms");
        }
    }
}