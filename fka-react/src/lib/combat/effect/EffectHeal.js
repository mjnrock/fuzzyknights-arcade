import Effect, { EnumEffectType } from "./Effect";
import { EnumComponentType } from "../../entity/components/Component";

export default class EffectHeal extends Effect {
    constructor(amount = 0, { method = "+", only, ignore } = {}) {
        super({
            type: EnumEffectType.HEAL,
            effect: function(entity) {
                const life = entity.getComponent(EnumComponentType.LIFE);

                console.log(life.HP)

                if(life) {
                    if(method === "-") {
                        life.HP.subtract(amount);
                    } else if(method === "+") {
                        life.HP.add(amount);
                    } else if(method === "%") {
                        life.HP.percent(amount);
                    } else if(method === "-%") {
                        life.HP.subtract(Math.abs(life.HP.max - life.HP.min) * (amount / 100));
                    } else if(method === "+%") {
                        life.HP.add(Math.abs(life.HP.max - life.HP.min) * (amount / 100));
                    }
                }
            },
            only,
            ignore,
        });

        this.amount = amount;
    }
}