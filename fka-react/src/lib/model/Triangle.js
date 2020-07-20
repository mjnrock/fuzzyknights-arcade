import Model from "./Model";
import Circle from "./Circle";

export default class Triangle extends Model {
    constructor(dx0, dy0, dx1, dy1) {
        super();

        this.edgeA = {
            x: dx0,
            y: dy0,
        };
        this.edgeB = {
            x: dx1,
            y: dy1,
        };
    }

    getTriangle(x, y, { scale = 1 } = {}) {
        return [
            [ x, y ],
            [ x + (this.edgeA.x / scale), y + (this.edgeA.y / scale) ],
            [ x + (this.edgeB.x / scale), y + (this.edgeB.y / scale) ],
        ];
    }
    
    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this === m0) {
            return false;
        }

        if(m0 instanceof Circle) {
            const tps = this.getTriangle(x, y, { scale });

            return Model.Detect.CirclePolygon(tps, mx, my, m0.radius / scale);
        } else if(m0 instanceof Triangle) {
            const tps0 = this.getTriangle(x, y, { scale });
            const tps1 = m0.getTriangle(mx, my, { scale });

            return Model.Detect.PolygonPolygon(tps0, tps1);
        }
    }
};