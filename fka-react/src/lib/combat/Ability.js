export default class Ability {
    /**
     * @param {Requirement[]} requirements [ [] ] | An array of requirements that can be checked against for invocation
     * @param {Effect[]} effects [ [] ] | An array of effects that will be processed in insertion order
     * @param {number} cooldown | For how long the Entity will be locked out of further Actions (i.e. recovery time)
     */
    constructor(requirements = [], effects = [], cooldown) {;
        this.requirements = requirements;
        this.effects = effects;
        this.cooldown = cooldown;
    }

    judge(entity, ...args) {
        return this.requirements.every(r => r.judge(entity, ...args));
    }

    affect(entity, ...args) {
        for(let effect of this.effects) {
            effect.affect(entity, ...args);
        }
        
        return this;
    }
};