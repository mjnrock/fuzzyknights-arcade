import Component, { EnumComponentType } from "./Component";
import Attribute from "./lib/Attribute";
import { Enumerator } from "../../hive/Helper";

export const EnumResourceType = Enumerator({
    HEALTH: 2 << 0,
    MANA: 2 << 1,
});

export default class Life extends Component {
    constructor({ hp = [], mana = [] } = {}) {
        super(EnumComponentType.LIFE, {
            [ EnumResourceType.HEALTH ]: new Attribute(EnumResourceType.HEALTH, hp[ 0 ], { name: "Health", min: hp[ 1 ], max: hp[ 2 ]}),
            [ EnumResourceType.MANA ]: new Attribute(EnumResourceType.MANA, mana[ 0 ], { name: "Mana", min: mana[ 1 ], max: mana[ 2 ]}),
        });
    }

    get HP() {
        return this.state[ EnumResourceType.HEALTH ];
    }
    get MANA() {
        return this.state[ EnumResourceType.MANA ];
    }
};