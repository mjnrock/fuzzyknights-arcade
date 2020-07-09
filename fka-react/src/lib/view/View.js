import Hive from "@lespantsfancy/hive";
import MouseNode from "./../hive/MouseNode";
import KeyNode from "./../hive/KeyNode";

import Component from "./components/Component";

export default class View extends Hive.Node {
    constructor() {
        super({
            components: new Map(),
            mouse: new MouseNode({ element: window }),
            key: new KeyNode({ element: window }),
        });

        this.mouse.addEffect((state, msg) => this.receive(msg.type, msg.payload, msg));
        this.key.addEffect((state, msg) => this.receive(msg.type, msg.payload, msg));
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
        for(let [ name, value ] of this.components) {
            comps.push({
                name: name,
                x: value.x,
                y: value.y,
                w: value.width,
                h: value.height,
                component: value,
            });
        }

        return comps;
    }

    get(name) {
        return this.components.get(name);
    }
    set(name, comp) {
        if(comp instanceof Component) {
            this.components.set(name, comp);
        }

        return this;
    }
    
    find(comp) {        
        for(let [ name, value ] of this.components) {
            if(comp === value) {
                return {
                    name,
                    component: comp,
                };
            }
        }

        return {
            name: null,
            component: null,
        };
    }
    remove(nameOrComp) {
        if(nameOrComp instanceof Component) {
            const entry = this.find(nameOrComp);

            if(entry.name) {
                this.components.delete(entry.name);

                return true;
            }
        } else {
            this.components.delete(nameOrComp);

            return true;
        }

        return false;
    }

    rename(name, newName) {
        const entry = this.get(name);

        this.remove(name);
        this.set(newName, entry);

        return this;
    }

    each(fn) {
        if(typeof fn === "function") {
            for(let [ name, comp ] of this.components) {
                fn(name, comp);
            }
        }
    }

    receive(state, msg) {}
};