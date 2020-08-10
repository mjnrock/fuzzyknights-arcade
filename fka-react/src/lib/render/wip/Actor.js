import Character from "./Character";

export default class Actor {
    constructor(entity, ...methodsOrCharacter) {
        this.entity = entity;

        if(methodsOrCharacter[ 0 ] instanceof Character) {
            this.character = methodsOrCharacter[ 0 ];
        } else {
            this.character = new Character(...methodsOrCharacter);
        }
    }

    get change() {
        return this.character.change;
    }
    get grow() {
        return this.character.change;
    }
    get retire() {
        return this.character.change;
    }

    /**
     * This should be overwritten and is used as a hook in .perform(...args)
     */
    act() {}

    perform(...args) {
        const img = this.character.perform(...args);

        return this.act(this.entity, img) || img;
    }

    static FromVisions(entity, ...visions) {
        return new Actor(entity, Character.FromVisions(...visions));
    }
};