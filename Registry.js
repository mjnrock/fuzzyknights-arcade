import Hive from "@lespantsfancy/hive";
import { v4 as uuid4 } from "uuid";

export const EnumEventType = {
    ADD: "Registry.ADD",
    REMOVE: "Registry.REMOVE",
    NEW_ID: "Registry.NEW_ID",
};

export default class Registry extends Hive.Node {
    constructor(state = {}) {
        super(state);

        this.state = {
            entries: new Map(),
            ids: new WeakMap(),
        };
    }

    get entries() {
        return this.state.entries;
    }
    get ids() {
        return this.state.ids;
    }

    add(...entries) {
        for(let entry of entries) {
            let id = entry.id == null ? uuid4() : entry.id;
    
            this.entries.set(entry, id);
            this.ids.set(id, entry);

            this.emit(EnumEventType.ADD, entry);
        }

        return this;
    }
    remove(...entries) {
        for(let entry of entries) {
            this.entries.delete(entry);
            this.ids.delete(this.id(entry));

            this.emit(EnumEventType.REMOVE, entry);
        }

        return this;
    }

    id(entry) {
        return this.entries.get(entry);
    }

    get(id) {
        return this.entries.ids.get(id);
    }

    newId(entry, id) {
        let oldId = this.entries.get(entry),
            newId = id == null ? uuid4() : id;

        if(!(entry.id == null)) {
            entry.id = newId;
        }
        this.ids.delete(oldId);
        this.ids.set(newId, entry);

        this.emit(EnumEventType.NEW_ID, {
            current: newId,
            previous: oldId,
        });

        return newId;
    }
};