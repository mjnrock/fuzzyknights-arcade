import Model from "./Model";

//TODO Change all polygons to inherit from here to simplify hasCollision testing
export default class Polygon extends Model {
    constructor() {
        super();
    }
    
    hasCollision(x, y, m0, mx, my, { scale = 1 } = {}) {
        if(this === m0) {
            return false;
        }

        if("radius" in m0) {
            const tps = this.getTriangle(x, y, { scale });

            return Model.Detect.CirclePolygon(tps, mx, my, m0.radius / scale);
        } else if(m0 instanceof Polygon) {
            return m0.hasCollision(x, y, m0, mx, my, { scale });
        }
    }
};