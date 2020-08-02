import { EnumComponentType } from "./../entity/components/Component";
import GridCanvasNode from "../hive/GridCanvasNode";

export default class HUD extends GridCanvasNode {
    constructor(camera) {
        super({ canvas: camera.canvas, size: [ camera.tw, camera.th ] });

        this.isActive = true;
    }

    turnOn() {
        this.isActive = true;
    }
    turnOff() {
        this.isActive = false;
    }

    getColorFromScale(value, scale = []) {
        for(let step of scale) {
            if(Array.isArray(step)) {
                const [ threshold, color ] = step;

                if(value >= threshold) {
                    return color;
                }
            } else {
                return step;
            }
        }
    }
    // getColorFromWeightedPool() {}

    barHealth(life, x, y) {
        let color = this.getColorFromScale(life.HP.asRate, [
            [ 0.93, "#5c9e6a" ],
            [ 0.85, "#8ed18f" ],
            [ 0.75, "#bad18e" ],
            [ 0.6, "#d1cd8e" ],
            [ 0.4, "#d1b28e" ],
            "#d18e8e",
        ]);

        this.prop({
            strokeStyle: "#000",
        }).rect(x * this.tw - this.tw / 4, y * this.th - this.th / 2, this.tw / 2, 10);
        this.prop({
            fillStyle: color,
        }).rect(x * this.tw - this.tw / 4 + 1, y * this.th - this.th / 2 + 1, (life.HP.asRate * this.tw / 2) - 1, 8, { isFilled: true });
    }
    barResource(life, x, y) {
        this.prop({
            strokeStyle: "#000",
        }).rect(x * this.tw - this.tw / 4, y * this.th - this.th / 2 + 14, this.tw / 2, 10);
        this.prop({
            fillStyle: "#369",
        }).rect(x * this.tw - this.tw / 4 + 1, y * this.th - this.th / 2 + 14 + 1, (life.MANA.asRate * this.tw / 2) - 1, 8, { isFilled: true });
    }


    draw({ canvas, x, y, entity, game } = {}) {
        if(this.isActive === true) {
            if(this.canvas !== canvas) {
                this.canvas = canvas;
            }

            const lifeComp = entity.getComponent(EnumComponentType.LIFE);
            if(lifeComp) {
                this.barHealth(lifeComp, x, y);
                this.barResource(lifeComp, x, y);
            }
        }
    }
}