import Dimension from "./Dimension";

export default class Grid extends Dimension {
    constructor(width, height, { setter, seed } = {}) {
        super({
            cardinality: 2,
            size: [ width, height ],
            setter,
            seed
        });
    }

    col(x) {
        return this.cells[ x ];
    }
    row(y) {
        const arr = [];

        this.cells.forEach(col => {
            arr.push(col[ y ]);
        });

        return arr;
    }

    cell(x, y) {
        return this.cells[ x ][ y ];
    }
    data(x, y, data) {
        if(data !== void 0) {
            this.cells[ x ][ y ].data = data;
        }

        return this.cells[ x ][ y ].data;
    }
    meta(x, y, meta) {
        if(meta !== void 0) {
            this.cells[ x ][ y ].meta = meta;
        }

        return this.cells[ x ][ y ].meta;
    }
}