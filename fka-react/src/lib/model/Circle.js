import Model from "./Model";
import Triangle from "./Triangle";

export default class Circle extends Model {
    constructor(radius) {
        super();

        this.radius = radius;
    }

    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this === m0) {
            return false;
        }

        if("radius" in m0) {
            return Model.Detect.CircleCircle(x, y, this.radius / scale, mx, my, m0.radius / scale);
        } else if(m0 instanceof Triangle) {
            const tps = m0.getTriangle(mx, my, { scale });

            return Model.Detect.CirclePolygon(tps, x, y, this.radius / scale);
        }
    }
};