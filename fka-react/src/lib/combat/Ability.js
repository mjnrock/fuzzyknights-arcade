export default class Ability {
    constructor({ effects = [] } = {}) {;
        this.effects = effects;
    }

    //TODO This is going to take some testing to make this work properly (e.g. with EffectSpawn)
    affect(entity, ...args) {
        for(let effect of this.effects) {
            effect.affect(entity, ...args);
        }

        return this;
    }
};