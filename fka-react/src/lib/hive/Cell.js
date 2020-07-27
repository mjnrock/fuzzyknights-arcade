export default class Cell {
    constructor({ data = {}, meta = {}, dimension, coords = [] } = {}) {
        this._meta = {
            _dimension: dimension,
            _coords: coords,

            ...meta
        };
        this._data = typeof data !== "object" ? { _value: data } : data;
    }

    get data() {
        if("_value" in this._data) {
            return this._data._value;
        }

        return this._data;
    }
    set data(data) {
        if(typeof data !== "object") {
            this._data = { _value: data };
        } else {
            this._data = data;
        }

        return this;
    }

    get meta() {
        return this._meta;
    }
    set meta(meta) {
        this._meta = meta;
    }

    get dimension() {
        return this._meta._dimension;
    }
    get coords() {
        return this._meta._coords;
    }
}