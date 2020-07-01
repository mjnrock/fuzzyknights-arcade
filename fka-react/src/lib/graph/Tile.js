import EventEmitter from "events";
import { v4 as uuidv4 } from "uuid";

import Terrain from "./Terrain";

export const EnumEventType = {
    ACTIVATE: "ACTIVATE",
    DEACTIVATE: "DEACTIVATE",
    ENTITY_ENTER: "ENTITY_ENTER",
    ENTITY_LEAVE: "ENTITY_LEAVE",
};

export default class Tile extends EventEmitter {
    constructor(terrain, entities = [], { isNavigable = true, isInteractable = false } = {}) {
        super();
        this.id = uuidv4();

        this.config = {
            isNavigable: isNavigable,
            isInteractable: isInteractable,
        };

        this.state = {
            terrain: terrain instanceof Terrain ? terrain : new Terrain(terrain),
            entities: entities,
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

    get entities() {
        return this.state.entities;
    }
    set entities(arr) {
        if(Array.isArray(arr)) {
            this.mergeState({
                entities: arr,
            });
        }
    }

    entity(index = 0) {
        return this.entities[ index ];
    }
    find(...indexesOrTypes) {
        return this.entities.filter((entity, i) => {
            if(indexesOrTypes.includes(i)) {
                return true;
            } else if(indexesOrTypes.some(entry => !Number.isInteger(entry) && entity.type === entry)) {
                return true;
            }

            return false;
        });
    }

    addEntity(entity) {
        this.entities.push(entity);
        this.emit(EnumEventType.ENTITY_ENTER, entity);
        
        return this;
    }
    removeEntity(entity) {
        this.entities = this.entities.filter(ent => ent !== entity);
        this.emit(EnumEventType.ENTITY_LEAVE, entity);
        
        return this;
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