import EventEmitter from "events";
import Cell from "./Cell";

export default class Dimension extends EventEmitter {
    constructor({ cardinality = 2, size, setter, seed } = {}) {
        super();
        
        this.cardinality = cardinality;
        this.size = size;

        if(Array.isArray(size) && size.length !== cardinality) {
            throw new Error("@size must have same cardinality as Dimension when not cubic.");
        }

        this.setter = setter;
        this.cells = [];

        Dimension.InitializeCells.call(this, this.cells, this.cardinality, this.size, seed || this.setter);
    }

    /**
     * This function, though static, requires a "this" binding, such as via .call()
     */
    static InitializeCells(cells, cardinality, size, setter, depth = []) {
        if(typeof size === "number") {
            const lens = [];
            for(let i = 0; i < cardinality; i++) {
                lens.push(size);
            }
    
            size = lens;
        }
    
        if(!Array.isArray(cells)) {
            cells = [];
        }
        
        for(let i = 0; i < size[ 0 ]; i++) {
            if(cardinality - 1 > 0) {
                cells.push(Dimension.InitializeCells.call(this, cells[ i ], cardinality - 1, size.slice(1), setter, [ ...depth, i ]));
            } else {
                const cell = new Cell({
                    dimension: this,
                    coords: [ ...depth, i ],
                });

                if(typeof setter === "function") {
                    cell.data = setter.call(this, i, [ ...depth, i ], cardinality, size.slice(1), setter)
                }
                
                cells.push(cell);
            }
        }
    
        return cells;
    }
    
    /**
     * @dims should be the "starting" coordinates, while @lengths is the "width" of that dimension
     */
    dive(dims, lengths, { accumulator, target, extractor } = {}) {
        if(!Array.isArray(accumulator)) {
            accumulator = [];
        }

        target = target || this.cells;

        for(let i = dims[ 0 ]; i < dims[ 0 ] + lengths[ 0 ]; i++) {
            if(dims.length > 1) {
                accumulator.push(this.dive(dims.slice(1), lengths.slice(1), { accumulator: accumulator[ i ], target: target[ i ], extractor }));
            } else {
                if(typeof extractor === "function") {
                    accumulator.push(extractor.call(this, target[ i ]));
                } else {
                    accumulator.push(target[ i ]);
                }
            }
        }

        return accumulator;
    }

    get(...coords) {
        let result = this.cells;

        for(let i of coords) {
            result = result[ i ];
        }

        return result;
    }
    set() {
        const args = [ ...arguments ];

        if(args.length === this.cardinality + 1) {
            const value = args[ args.length - 1 ];
            
            let result = this.cells;

            for(let i of args.slice(0, arguments.length - 2)) {
                result = result[ i ];
            }

            result[ args[ args.length - 2 ] ] = value;
        }

        return this;
    }
    swap() {
        const args = [ ...arguments ];

        if(args.length % 2 === 0) {
            const left = args.slice(0, args.length / 2);
            const right = args.slice(args.length / 2);

            const c0 = this.get(...left);
            const c1 = this.get(...right);

            this.set(...left, c1);
            this.set(...right, c0);
        }

        return this;
    }
    clear() {
        this.set(...arguments, null);

        return this;
    }

    isEmpty() {
        const cell = this.get(...arguments);

        return cell === void 0 || cell === null;
    }

    each(fn) {
        if(typeof fn === "function") {            
            const arr = [];
            const lens = [];
            for(let i = 0; i < this.cardinality; i++) {
                arr.push(0);
                lens.push(this.size[ i ]);
            }

            return this.dive(arr, lens, { extractor: fn });
        }
    }

    /**
     * The cardinality of @coords must be equal to this.cardinality (i.e. leaf-level only)
     */
    range(coords = [], lengths = [], opts = {}) {
        if(coords.length !== this.cardinality) {
            throw new Error(".range() must have cardinality equal to the Dimension; it is a leaf-level only function.");
        }

        if(typeof lengths === "number") {
            return this.dive(coords, coords.map(() => lengths), opts);
        }

        return this.dive(coords, lengths, opts);
    }
    all() {
        return this.cells;
    }

    toData(extractor) {
        const arr = [];
        const lens = [];
        for(let i = 0; i < this.cardinality; i++) {
            arr.push(0);
            lens.push(this.size[ i ]);
        }

        return this.dive(arr, lens, { extractor: extractor || (cell => cell.data) });
    }
    toMeta(extractor) {
        return this.toData(extractor || (cell => cell.meta));
    }
}