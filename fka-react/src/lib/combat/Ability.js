export default class Ability {
    constructor(cost = 0, effects = []) {;
        this.cost = cost;
        this.effects = effects;
    }

    affect(entity, ...args) {
        for(let effect of this.effects) {
            effect.affect(entity, ...args);
        }
        
        return this;
    }
};