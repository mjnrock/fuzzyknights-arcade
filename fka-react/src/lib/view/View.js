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

        this.mouse.addEffect((state, msg) => {
            console.log(msg.type, msg.payload)
        });
        this.key.addEffect((state, msg) => {
            console.log(msg.type, msg.payload)
        });
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
                x: value.component.x,
                y: value.component.y,
                w: value.component.width,
                h: value.component.height,
                component: value.component,
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
                    component,
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
};