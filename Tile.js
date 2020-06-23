import EventEmitter from "events";
import Terrain from "./Terrain";

export const EnumEventType = {
    ACTIVATE: "ACTIVATE",
    DEACTIVATE: "DEACTIVATE",
};

export default class Tile extends EventEmitter {
    constructor(terrain, { isNavigable = true, isInteractable = false } = {}) {
        super();
        
        if(terrain instanceof Terrain) {
            this.terrain = terrain;
        } else {
            this.terrain = new Terrain(terrain);
        }

        this.state = {
            isNavigable: isNavigable,
            isInteractable: isInteractable,
        };

        this.on(EnumEventType.ACTIVATE, () => this.onActivate.bind(this));
        this.on(EnumEventType.DEACTIVATE, () => this.onDeactivate.bind(this));
    }

    flag(option, value) {
        if(option in this.state.isNavigable) {
            this.state.isNavigable[ option ] = value;
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

    activate() {
        this.emit(EnumEventType.ACTIVATE, this);
    }
    deactivate() {
        this.emit(EnumEventType.DEACTIVATE, this);
    }

    onActivate() {}
    onDeactivate() {}
};