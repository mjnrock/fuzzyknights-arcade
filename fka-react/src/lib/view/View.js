import Hive from "@lespantsfancy/hive";
import MouseNode from "./../hive/MouseNode";
import KeyNode from "./../hive/KeyNode";

export default class View extends Hive.Node {
    constructor({ cols = 10, rows = 10 } = {}) {
        super({
            columns: cols,
            rows: rows,
            components: new Map(),
            mouse: new MouseNode({ element: window }),
            key: new KeyNode({ element: window }),
        });

        this.mouse.addEffect((state, msg) => {
            console.log(msg.type, msg.payload)
        });
        this.key.addEffect((state, msg) => {
            console.log(msg.type, msg.payload)
        });
    }

    get cols() {
        return this.state.columns;
    }
    get rows() {
        return this.state.rows;
    }
    get mouse() {
        return this.state.mouse;
    }
    get key() {
        return this.state.key;
    }

    get components() {
        return this.state.components;
    }

    get data() {
        let comps = [];
        for(let [ key, value ] of this.components) {
            comps.push({
                key: key,
                x: value.x,
                y: value.y,
                w: value.component.width,
                h: value.component.height,
                component: value.component,
            });
        }

        return comps;
    }

    _kvp(x, y, comp) {
        const key = `${ x }.${ y }`;

        if(arguments.length === 2) {
            return key;
        } else if(arguments.length === 3) {
            return {
                key: key,
                value: {
                    x: x,
                    y: y,
                    component: comp,
                },
            };
        }
    }

    get(x, y) {
        const key = this._kvp(x, y);

        return this.components.get(key);
    }
    set(x, y, comp) {
        const kvp = this._kvp(x, y, comp);

        this.components.set(kvp.key, kvp.value);

        return this;
    }
    
    find(comp) {        
        for(let [ key, value ] of this.components) {
            if(comp === value) {
                return {
                    key,
                    value,
                };
            }
        }

        return {
            key: null,
            value: null,
        };
    }
    remove(posOrComp) {
        if(arguments.length === 1) {
            const entry = this.find(posOrComp);

            if(entry.key) {
                this.components.delete(entry.key);

                return true;
            }
        } else if(arguments.length === 2) {
            const key = this._kvp(...arguments);
    
            this.components.delete(key);

            return true;
        }

        return false;
    }

    swap(x0, y0, x1, y1) {
        const e0 = this.get(x0, y0);
        const e1 = this.get(x1, y1);

        e0.x = x1;
        e0.y = y1;

        e1.x = x0;
        e1.y = y0;

        this.set(x0, y0, e1);
        this.set(x1, y1, e0);

        return this;
    }
};