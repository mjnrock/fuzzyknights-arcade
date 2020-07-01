import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Terrain from "./Terrain";

export const EnumEventType = {
    ACTIVATE: "ACTIVATE",
    DEACTIVATE: "DEACTIVATE",
};

export default class Tile extends EventEmitter {
    constructor(terrain, { isNavigable = true, isInteractable = false } = {}) {
        super();
        this.id = uuidv4();

        this.config = {
            isNavigable: isNavigable,
            isInteractable: isInteractable,
        };

        this.state = {
            terrain: terrain instanceof Terrain ? terrain : new Terrain(terrain),
            isActive: false,
        };

        this.on(EnumEventType.ACTIVATE, (...args) => this.onActivate.call(this, ...args));
        this.on(EnumEventType.DEACTIVATE, (...args) => this.onDeactivate.call(this, ...args));
    }

    get terrain() {
        return this.state.terrain;
    }
    set terrain(value) {
        this.mergeState({
            terrain: value,
        });
    }
    
    flag(option, value) {
        if(option in this.config) {
            this.config[ option ] = value;
        }

        return this;
    }
    flagOn(option) {
        this.flag(option, true);

        return this;
    }
    flagOff(option) {
        this.flag(option, false);

        return this;
    }

    attempt(fnOrBool) {
        if(fnOrBool === true) {
            this.activate();
        } else if(fnOrBool === false) {
            this.deactivate();
        } else if(typeof fnOrBool === "function") {
            const result = fnOrBool(this);

            if(result === true) {
                this.activate();
            } else if(result === false) {
                this.deactivate();
            }
        }
        
        return this;
    }

    activate() {
        this.state.isActive = true;
        this.emit(EnumEventType.ACTIVATE, Date.now());
    }
    deactivate() {
        this.state.isActive = false;
        this.emit(EnumEventType.DEACTIVATE, Date.now());
    }

    onActivate() {}
    onDeactivate() {}
};