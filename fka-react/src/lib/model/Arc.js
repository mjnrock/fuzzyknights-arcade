import Model from "./Model";

export default class Arc extends Model {
    constructor(radius, start, end) {
        super();

        this.radius = radius;
        this.start = start;
        this.end = end;
    }

    getTriangle(x, y) {
        return [
            [ x, y ],
            [ x + this.radius * Math.cos(this.start / 180 * Math.PI), y + this.radius * Math.sin(this.start / 180 * Math.PI) ],
            [ x + this.radius * Math.cos(this.end / 180 * Math.PI), y + this.radius * Math.sin(this.end / 180 * Math.PI) ],
        ];
    }
    
    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this !== m0 && "radius" in m0) {
            const tps = this.getTriangle(x, y);

            return Model.Detect.CirclePolygon(tps, mx, my, m0.radius);
            return Math.pow(x - mx, 2) + Math.pow(y - my, 2) <= Math.pow((this.radius + m0.radius) / scale, 2);
        }
    }
};