import Arc from "../model/Arc";

export default class Ability {
    constructor({ radius, start = 0, end = 360, effects = [] } = {}) {
        this.radius = radius;
        this.start = start;
        this.end = end;
        this.effects = effects;
    }

    sweep(x, y, facing) {
        const arc = new Arc(this.radius, this.start, this.end);

        
    }
};