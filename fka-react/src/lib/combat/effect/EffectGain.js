import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectGain extends Effect {
    constructor(amount = 0, { method = "+", only, ignore } = {}) {
        super({
            type: EnumEffectType.GAIN,
            effect: function(ea, target) {
                const life = target.getComponent(EnumComponentType.LIFE);

                if(life) {
                    if(method === "-") {
                        life.MANA.subtract(amount);
                    } else if(method === "+") {
                        life.MANA.add(amount);
                    } else if(method === "%") {
                        life.MANA.percent(amount);
                    } else if(method === "-%") {
                        life.MANA.subtract(Math.abs(life.MANA.max - life.MANA.min) * (amount / 100));
                    } else if(method === "+%") {
                        life.MANA.add(Math.abs(life.MANA.max - life.MANA.min) * (amount / 100));
                    }
                }
            },
            only,
            ignore,
        });

        this.amount = amount;
    }
}