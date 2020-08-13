import { EnumComponentType } from "../entity/components/Component";
import GridCanvasNode from "../hive/GridCanvasNode";

export default class HUD extends GridCanvasNode {
    constructor(camera) {
        super({
            state: {
                camera: camera,
            },
            width: camera.width,
            height: camera.height,
            size: [ camera.tw, camera.th ]
        });

        this.isActive = true;
    }

    get camera() {
        return this.state.camera;
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
        }).rect(x * this.tw + this.tw / 4, y * this.th - 14, this.tw / 2, 10);
        this.prop({
            fillStyle: color,
        }).rect(x * this.tw + this.tw / 4, y * this.th - 14 + 1, (life.HP.asRate * this.tw / 2) - 1, 8, { isFilled: true });
    }
    barResource(life, x, y) {
        this.prop({
            strokeStyle: "#000",
        }).rect(x * this.tw + this.tw / 4, y * this.th, this.tw / 2, 10);
        this.prop({
            fillStyle: "#369",
        }).rect(x * this.tw + this.tw / 4, y * this.th + 1, (life.MANA.asRate * this.tw / 2) - 1, 8, { isFilled: true });
    }


    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, node, game } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        if(this.isActive === true) {
            node.each((entity, i) => {
                const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
    
                if((rb.x >= x) && (rb.x <= (x + w)) && (rb.y >= y) && (rb.y <= (y + h))) {
                    const life = entity.getComponent(EnumComponentType.LIFE);

                    if(life) {
                        this.barHealth(life, rb.x, rb.y);
                        this.barResource(life, rb.x, rb.y);
                    }
                }
            });
        }
        this.ctx.restore();
    }
}