import Component, { EnumComponentType } from "./Component";
import Attribute from "./lib/Attribute";
import { Enumerator } from "../../hive/Helper";

export const EnumResourceType = Enumerator({
    HEALTH: 2 << 0,
    MANA: 2 << 1,
    RAGE: 2 << 2,
    ENERGY: 2 << 3,
});

export default class Life extends Component {
    constructor({ hp = [], mana = [], rage = [], energy = [] } = {}) {
        super(EnumComponentType.LIFE, {
            [ EnumResourceType.HEALTH ]: new Attribute(EnumResourceType.HEALTH, hp[ 0 ], { name: "Health", min: hp[ 1 ], max: hp[ 2 ]}),
            [ EnumResourceType.MANA ]: new Attribute(EnumResourceType.MANA, mana[ 0 ], { name: "Mana", min: mana[ 1 ], max: mana[ 2 ]}),
            [ EnumResourceType.RAGE ]: new Attribute(EnumResourceType.RAGE, rage[ 0 ], { name: "Rage", min: rage[ 1 ], max: rage[ 2 ]}),
            [ EnumResourceType.ENERGY ]: new Attribute(EnumResourceType.ENERGY, energy[ 0 ], { name: "Energy", min: energy[ 1 ], max: energy[ 2 ]}),
        });

        console.log(hp, energy)
    }

    get HEALTH() {
        return this.state[ EnumResourceType.HEALTH ];
    }
    get MANA() {
        return this.state[ EnumResourceType.MANA ];
    }
    get RAGE() {
        return this.state[ EnumResourceType.RAGE ];
    }
    get ENERGY() {
        return this.state[ EnumResourceType.ENERGY ];
    }

    get isDead() {
        return this.HEALTH.isEmpty;
    }
};