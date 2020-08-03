export default class Resource {
    constructor(value, { min, max, setter } = {}) {
        this.min = min;
        this.max = max;
        
        this._value = value;
        
        this.setter = setter;
    }

    get value() {
        return this._value;
    }
    set value(value) {
        if(typeof this.setter === "function") {
            this._value = this.setter.call(this, Math.max(this.min, Math.min(this.max, value)));
        } else {
            this._value = Math.max(this.min, Math.min(this.max, value));
        }
    }

    add(value = 1, treatAsCost = false) {
        if(treatAsCost === true) {
            if(this.value + value <= this.max) {
                this.value += value;

                return true;
            }

            return false;
        } else {
            this.value += value;
        }

        return this;
    }
    subtract(value = 1, treatAsCost = false) {
        if(treatAsCost === true) {
            if(this.value - value >= this.min) {
                this.value -= value;

                return true;
            }

            return false;
        } else {
            this.value -= value;
        }

        return this;
    }
    multiply(value = 1) {
        this.value *= value;

        return this;
    }
    divide(value = 1) {
        this.value /= value;

        return this;
    }
    power(value = 1) {
        this.value = this.value ** value;

        return this;
    }

    rate(rate = 1.0) {
        this.value = this.min + (Math.abs(this.max - this.min) * rate);

        return this;
    }
    percent(percent = 100) {
        return this.rate(percent / 100);
    }

    test(costOrFn) {
        if(typeof costOrFn === "function") {
            return costOrFn(this);
        }

        return this.value - costOrFn >= 0;
    }

    get isEmpty() {
        return this.value <= this.min;
    }
    get isFull() {
        return this.value >= this.max;
    }

    get asRate() {
        let num = this.value - this.min;
        let den = this.max - this.min;

        return num / den;
    }
    get asPercent() {
        return this.asRate * 100.0;
    }

    fill() {
        this.value = this.max;

        return this;
    }
    empty() {
        this.value = this.min;

        return this;
    }
}