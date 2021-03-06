import Model from "./Model";
import Circle from "./Circle";

export default class Arc extends Model {
    constructor(radius, left, right) {
        super();

        this.radius = radius;
        
        this.left = left;
        this.right = right;
    }

    getTriangle(x, y, { rotation = -90, scale = 1 } = {}) {
        return [
            [ x, y ],
            [ x + this.radius * Math.cos((this.left + rotation) / 180 * Math.PI) / scale, y + this.radius * Math.sin((this.left + rotation) / 180 * Math.PI) / scale ],
            [ x + this.radius * Math.cos((this.right + rotation) / 180 * Math.PI) / scale, y + this.radius * Math.sin((this.right + rotation) / 180 * Math.PI) / scale ],
        ];
    }
    
    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this === m0) {
            return false;
        }

        if(m0 instanceof Circle) {
            const tps = this.getTriangle(x, y, { scale });

            return Model.Detect.CirclePolygon(tps, mx, my, m0.radius / scale)
                || Model.Detect.CircleArc(mx, my, m0.radius / scale, x, y, this.radius / scale, this.left, this.right);
        }
    }
};