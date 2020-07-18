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

    barHealth(life, x, y) {
        let color = "#5c9e6a";

        if(life.HP.rate >= 0.93) {
            color = "#5c9e6a";
        } else if(life.HP.rate >= 0.85) {
            color = "#8ed18f";
        } else if(life.HP.rate >= 0.75) {
            color = "#bad18e";
        } else if(life.HP.rate >= 0.6) {
            color = "#d1cd8e";
        } else if(life.HP.rate >= 0.4) {
            color = "#d1b28e";
        } else {
            color = "#d18e8e";
        }

        this.prop({
            strokeStyle: "#000",
        }).rect(x * this.tw - this.tw / 4, y * this.th - this.th / 2, this.tw / 2, 10);
        this.prop({
            fillStyle: color,
        }).rect(x * this.tw - this.tw / 4 + 1, y * this.th - this.th / 2 + 1, (life.HP.rate * this.tw / 2) - 1, 8, { isFilled: true });
    }
    barResource(life, x, y) {
        this.prop({
            strokeStyle: "#000",
        }).rect(x * this.tw - this.tw / 4, y * this.th - this.th / 2 + 14, this.tw / 2, 10);
        this.prop({
            fillStyle: "#369",
        }).rect(x * this.tw - this.tw / 4 + 1, y * this.th - this.th / 2 + 14 + 1, (life.MANA.rate * this.tw / 2) - 1, 8, { isFilled: true });
    }


    draw({ canvas, x, y, entity, game } = {}) {
        if(this.isActive === true) {
            if(this.canvas !== canvas) {
                this.canvas = canvas;
            }

            const lifeComp = entity.getComponent(EnumComponentType.LIFE);
            this.barHealth(lifeComp, x, y);
            this.barResource(lifeComp, x, y);
        }
    }
}