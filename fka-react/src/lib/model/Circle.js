import Model from "./Model";

export default class Circle extends Model {
    constructor(radius) {
        super();

        this.radius = radius;
    }

    hasIntersection(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this !== m0 && m0 instanceof Circle) {
            return Math.pow(x - mx, 2) + Math.pow(y - my, 2) <= Math.pow((this.radius + m0.radius) / scale, 2);
        }
    }
};