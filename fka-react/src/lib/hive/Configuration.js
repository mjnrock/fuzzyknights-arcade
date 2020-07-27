import EventEmitter from "events";

export const EnumEventType = {
    UPDATE: "Configuration.Update",
};

export default class Configuration extends EventEmitter {
    constructor(options, { state = {}, defaultsByKey = {}, defaultsByValue = {} } = {}) {
        super();

        this.state = state;
        this.options = options;

        if(!Object.keys(state).length) {
            for(let option in this.options) {
                if(option in defaultsByKey) {
                    this.setByKey(option, defaultsByKey[ option ], { suppress: true });
                } else if(option in defaultsByValue) {
                    this.setByValue(option, defaultsByValue[ option ], { suppress: true });
                } else {
                    this.state[ option ] = null;
                }
            }
        }
    }

    isValidKey(option, key) {
        const entries = this.options[ option ] || [];

        if(entries.length) {
            const falsey = (value) => ({
                __value: value,
            });

            let choice = entries.reduce((a, v, i) => {
                if(typeof v === "object" && (typeof key === "string" || key instanceof String)) {
                    const entry = v[ key ];
                    if(entry === 0 || entry === false) {
                        return (entry !== void 0 ? falsey(entry) : void 0) || a;
                    }

                    return (entry !== void 0 ? entry : void 0) || a;
                }

                if(v === 0 || v === false) {
                    return (key === i ? falsey(v) : void 0) || a;
                }

                return (key === i ? v : void 0) || a;
            }, void 0);

            if(choice !== void 0) {
                return true;
            }
        }

        return false;
    }
    isValidValue(option, value) {
        const entries = this.options[ option ] || [];

        if(entries.length) {
            let key;
            const choice = entries.reduce((a, v, i) => {
                if(typeof v === "object") {
                    const k = Object.keys(v)[ 0 ];

                    if(v[ k ] === value) {
                        key = k;
    
                        return v[ k ];
                    }
                } else {
                    if(v === value) {
                        key = i;    
    
                        return v;
                    }
                }

                return a;
            }, void 0);

            if(choice !== void 0 && key !== void 0) {
                return true;
            }
        }

        return false;
    }

    has(option) {
        return !!this.state[ option ];
    }

    key(option) {
        const entry = this.state[ option ] || [];

        return entry[ 0 ];
    }
    value(option) {
        const entry = this.state[ option ] || [];

        return entry[ 1 ];
    }    
    current(option) {
        return this.state[ option ] || [];
    }

    choices(option) {
        return this.options[ option ];
    }

    setByKey(option, key, { suppress = false } = {}) {
        const entries = this.options[ option ] || [];

        if(entries.length) {
            const falsey = (value) => ({
                __value: value,
            });

            let choice = entries.reduce((a, v, i) => {
                if(typeof v === "object" && (typeof key === "string" || key instanceof String)) {
                    const entry = v[ key ];
                    if(entry === 0 || entry === false) {
                        return (entry !== void 0 ? falsey(entry) : void 0) || a;
                    }

                    return (entry !== void 0 ? entry : void 0) || a;
                }

                if(v === 0 || v === false) {
                    return (key === i ? falsey(v) : void 0) || a;
                }

                return (key === i ? v : void 0) || a;
            }, void 0);

            if(choice !== void 0) {
                const oldValue = this.state[ option ];

                if(typeof choice === "object" && "__value" in choice) {
                    choice = choice.__value;
                }

                this.state[ option ] = [ key, choice ];

                if(!suppress) {
                    this.emit(EnumEventType.UPDATE, {
                        method: "key",
                        args: [ ...arguments ],
                        previous: oldValue,
                        current: this.state[ option ],
                    });
                }

                return true;
            }
        }

        return false;
    }
    setByValue(option, value, { suppress = false } = {}) {
        const entries = this.options[ option ] || [];

        if(entries.length) {
            let key;
            const choice = entries.reduce((a, v, i) => {
                if(typeof v === "object") {
                    const k = Object.keys(v)[ 0 ];

                    if(v[ k ] === value) {
                        key = k;
    
                        return v[ k ];
                    }
                } else {
                    if(v === value) {
                        key = i;    
    
                        return v;
                    }
                }

                return a;
            }, void 0);

            if(choice !== void 0 && key !== void 0) {
                const oldValue = this.state[ option ];

                this.state[ option ] = [ key, choice ];

                if(!suppress) {
                    this.emit(EnumEventType.UPDATE, {
                        method: "value",
                        args: [ ...arguments ],
                        previous: oldValue,
                        current: this.state[ option ],
                    });
                }

                return true;
            }
        }

        return false;
    }


    

    toObject() {
        return JSON.parse(JSON.stringify(this));
    }
    toJson(beautify = false) {
        if(beautify === true) {
            return JSON.stringify(this, null, 2);
        }

        return JSON.stringify(this);
    }

    static FromJson(json) {
        let obj = json;

        while(typeof obj === "string" || obj instanceof String) {
            obj = JSON.parse(obj);
        }

        return new Configuration(obj.options, {
            state: obj.state,
        });
    }

    toData({ flag = "both" } = {}) {
        if(flag === "both") {
            return this.state;
        }

        let obj = {};

        for(let option in this.state) {
            if(flag === "keys") {
                obj[ option ] = this.state[ option ][ 0 ];
            } else {
                obj[ option ] = this.state[ option ][ 1 ];
            }
        }

        return obj;
    }
    toKeys() {
        return this.toData({ flag: "keys" });
    }
    toValues() {
        return this.toData({ flag: "values" });
    }
}