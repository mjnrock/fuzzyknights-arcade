import Model from "./Model";

export default class Line extends Model {
    constructor(dx0, dy0) {
        super();

        this.edge = {
            x: dx0,
            y: dy0,
        };
    }

    getLine(x, y, { scale = 1 } = {}) {
        return [
            x, y,
            x + (this.edge.x / scale), y + (this.edge.y / scale),
        ];
    }
    
    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this !== m0 && "radius" in m0) {
            const lps = this.getLine(x, y, { scale });

            return Model.Detect.LineCircle(...lps, mx, my, m0.radius / scale);
        }
    }
};