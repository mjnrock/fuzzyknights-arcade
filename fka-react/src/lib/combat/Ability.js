export default class Ability {
    /**
     * @param {int|[ int, EnumResourceType ]} cost [ 0 ] | Either 0 (no cost) or an integer amount of a particular resource (e.g. [ 3, EnumResourceType.MANA ])
     * @param {Effect[]} effects [ [] ]| An array of effects that will be processed in insertion order
     */
    constructor(cost = 0, effects = [], duration) {;
        this.cost = cost;
        this.effects = effects;
        this.duration = duration;
    }

    affect(entity, ...args) {
        for(let effect of this.effects) {
            effect.affect(entity, ...args);
        }
        
        return this;
    }
};