export default class Ability {
    constructor({ effects = [] } = {}) {;
        this.effects = effects;
    }

    affect(entity) {
        for(let effect of this.effects) {
            effect.affect(entity);
        }

        return this;
    }
};