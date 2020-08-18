import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "./../../entity/components/Component";
// import EnumDamageType from "./../DamageType";

export default class EffectDamage extends Effect {
    constructor(type, amount = 0, { method = "-", only, ignore } = {}) {
        super({
            type: EnumEffectType.DAMAGE,
            effect: function(ea, target) {
                const life = target.getComponent(EnumComponentType.LIFE);

                //TODO Account for DamageType and accompanying Resistances
                if(life) {
                    if(method === "-") {
                        life.HEALTH.subtract(amount);
                    } else if(method === "+") {
                        life.HEALTH.add(amount);
                    } else if(method === "%") {
                        life.HEALTH.percent(amount);
                    } else if(method === "-%") {
                        life.HEALTH.subtract(Math.abs(life.HEALTH.max - life.HEALTH.min) * (amount / 100));
                    } else if(method === "+%") {
                        life.HEALTH.add(Math.abs(life.HEALTH.max - life.HEALTH.min) * (amount / 100));
                    }
                }
            },
            only,
            ignore,
        });

        this.type = type;
        this.amount = amount;
    }
}