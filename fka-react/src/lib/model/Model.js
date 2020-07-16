export default class Model {
    static LinearDistance(x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }

    static get Detect() {
        let obj = {};

        obj.PointLine = (x0, y0, x1, y1, px, py, { buffer = 0.1 } = {}) => {
            const d1 = Model.LinearDistance(px, py, x0, y0);
            const d2 = Model.LinearDistance(px, py, x1, y1);
            const ll = Model.LinearDistance(x0, y0, x1, y1);

            return d1 + d2 >= ll + buffer && d1 + d2 <= ll + buffer;
        };
        obj.PointCircle = (px, py, cx, cy, r) => {
            return Math.pow(px - cx, 2) + Math.pow(py - cy, 2) <= Math.pow(r, 2);
        };
        obj.PointPolygon = (vertices = [], px, py) => {
            let isCollision = false;

            let next = 0;
            for (let current = 0; current < vertices.length; current++) {
                next = next === vertices.length - 1 ? 0 : current + 1;

                const vc = { x: vertices[ current ][ 0 ], y: vertices[ current ][ 1 ] };
                const vn = { x: vertices[ next ][ 0 ], y: vertices[ next ][ 1 ] };

                if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)) {
                    isCollision = !isCollision;
                }
            }

            return isCollision;
        };
        obj.LineLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
            const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
            const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

            return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
        };
        obj.LineCircle = (x1, y1, x2, y2, cx, cy, r) => {
            let dist;

            const v1x = x2 - x1;
            const v1y = y2 - y1;
            const v2x = cx - x1;
            const v2y = cy - y1;
            const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);

            if (u >= 0 && u <= 1) {
                dist = (x1 + v1x * u - cx) ** 2 + (y1 + v1y * u - cy) ** 2;
            } else {
                dist = u < 0 ? (x1 - cx) ** 2 + (y1 - cy) ** 2 : (x2 - cx) ** 2 + (y2 - cy) ** 2;
            }

            return dist < r * r;
        };
        obj.LinePolygon = (vertices = [], x1, y1, x2, y2) => {
            let next = 0;
            for (let current = 0; current < vertices.length; current++) {
                next = next === vertices.length - 1 ? 0 : current + 1;

                const x3 = vertices[ current ][ 0 ];
                const y3 = vertices[ current ][ 1 ];
                const x4 = vertices[ next ][ 0 ];
                const y4 = vertices[ next ][ 1 ];

                if (obj.LineLine(x1, y1, x2, y2, x3, y3, x4, y4)) {
                    return true;
                }
            }

            return false;
        };
        obj.CircleArc = (cx, cy, cr, ax, ay, ar, thetaStart, thetaEnd) => {
            let theta = Math.atan2(cy - ay, cx - ax) * 180 / Math.PI;
            if(theta < 0) {
                theta += 360;
            }

            return Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2) <= Math.pow(cr + ar, 2)
                && theta >= thetaStart
                && theta <= thetaEnd;
        };
        obj.CircleCircle = (cx0, cy0, cr0, cx1, cy1, cr1) => {            
            return Math.pow(cx0 - cx1, 2) + Math.pow(cy0 - cy1, 2) <= Math.pow(cr0 + cr1, 2);
        };
        obj.CirclePolygon = (vertices = [], cx, cy, r) => {
            if (obj.PointPolygon(vertices, cx, cy)) {
                return true;
            }

            let next = 0;
            for (let current = 0; current < vertices.length; current++) {
                next = next === vertices.length - 1 ? 0 : current + 1;

                const vc = { x: vertices[ current ][ 0 ], y: vertices[ current ][ 1 ] };
                const vn = { x: vertices[ next ][ 0 ], y: vertices[ next ][ 1 ] };

                if (obj.LineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, r)) {
                    return true;
                }
            }

            return false;
        };
        obj.PolygonPolygon = (p0Vertices = [], p1Vertices = []) => {
            let next = 0;
            for (let current = 0; current < p0Vertices.length; current++) {
                next = next === p0Vertices.length - 1 ? 0 : current + 1;

                const vc = { x: p0Vertices[ current ][ 0 ], y: p0Vertices[ current ][ 1 ] };
                const vn = { x: p0Vertices[ next ][ 0 ], y: p0Vertices[ next ][ 1 ] };

                if (obj.LinePolygon(p1Vertices, vc.x, vc.y, vn.x, vn.y)) {
                    return true;
                }

                //TODO Test if polygon is within the other
            }

            return false;
        };

        return obj;
    }
};