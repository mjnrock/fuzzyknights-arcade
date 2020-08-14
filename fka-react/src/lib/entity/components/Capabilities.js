import Component, { EnumComponentType } from "./Component";
import Action from "../../combat/Action";

export const ACTION_LIMIT = {
    CURRENT: 6,
    LIBRARY: Infinity,
};

export default class Capabilities extends Component {
    constructor({ current = [], library = [] } = {}) {
        super(EnumComponentType.CAPABILITIES, {
            library: new Map(),  // The "spellbook"
            current: new Map(),  // The "equipped" equivalent for abilities
            lastAction: null,   // Use as a flag variable for the GCD
        });

        for(let action of library) {
            this.learn(action);
        }

        if(current.length) {
            this.state.current.clear();
            for(let action of current) {
                this.add(action);
            }
        }
    }

    get isCurrentOpen() {
        return this.state.current.size <= ACTION_LIMIT.CURRENT;
    }
    get isLibraryOpen() {
        return this.state.library.size <= ACTION_LIMIT.LIBRARY;
    }
    
    //* Utility Section
    //- Along with .get, these should be the main workhorse functions
    /**
     * "Equip" an Action into the current directory from the library
     * If the Action is not present within library then NOOP
     * @param {string} name 
     * @param {string[]|Action[]} remove 
     */
    equip(name, remove = []) {
        const action = this.search(name);

        if(action) {
            for(let r of remove) {
                this.unequip(r);
            }
    
            return this.set(name, action);
        }

        return false;
    }
    unequip(action) {
        if(action instanceof Action) {
            this.state.current.delete(action.name);

            return true;
        } else if(typeof action === "string" || action instanceof String) {
            this.state.current.delete(action);

            return true;
        }

        return false;
    }

    //* Library Section
    search(input) {        
        if(input instanceof Action) {
            return this.state.library.get(input.name);
        } else if(typeof input === "string" || input instanceof String) {
            return this.state.library.get(input);
        }
    }
    learn(action) {
        console.log(action)
        if(action instanceof Action && (this.isLibraryOpen || this.state.library.has(action.name))) {
            this.state.library.set(action.name, action);

            this.set(action.name, action);  // Automatically add to "current" if there is room, else ignore | The proper checks exist within .set(...)

            return true;
        }

        return false;
    }
    unlearn(action) {
        if(action instanceof Action) {
            this.state.library.delete(action.name);
            this.unequip(action.name);   // Remove from "current", if present

            return true;
        } else if(typeof action === "string" || action instanceof String) {
            this.state.library.delete(action);
            this.unequip(action);    // Remove from "current", if present

            return true;
        }

        return false;
    }
    /**
     * The library's equivalent of .index(...)
     * @param {int} index 
     */
    position(index) {
        const arr = [ ...this.state.library.values() ];

        return arr[ index ];
    }

    //* Current Section
    //- Mainly helper functions
    get(name) {
        return this.state.current.get(name);
    }
    set(name, action) {
        if(action instanceof Action && (this.isCurrentOpen || this.state.current.has(name))) {
            this.state.current.set(name, action);

            return true;
        }

        return false;
    }
    add(action) {
        return this.set(action.name, action);
    }
    /**
     * This is meant to be the major way that key bindings/invocations will interact with Capabilities, so as to not bind to specific Actions, but rather Action locations (e.g. Action Bar)
     * @param {int} index 
     */
    index(index) {
        const arr = [ ...this.state.current.values() ];

        return arr[ index ];
    }
}