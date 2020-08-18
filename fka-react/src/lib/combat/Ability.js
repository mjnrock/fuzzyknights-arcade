export default class Ability {
    /**
     * @param {Requirement[]} requirements [ [] ] | An array of requirements that can be checked against for invocation
     * @param {Effect[]} effects [ [] ] | An array of effects that will be processed in insertion order
     * @param {number} duration | For how long will the Ability "last"
     */
    constructor(requirements = [], effects = [], duration) {;
        this.requirements = requirements;
        this.effects = effects;
        this.duration = duration;
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