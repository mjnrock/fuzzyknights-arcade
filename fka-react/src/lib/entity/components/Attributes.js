import Component, { EnumComponentType } from "./Component";
import Attribute from "./lib/Attribute";
import { Enumerator } from "../../hive/Helper";

export const EnumAttributeType = Enumerator({
    STRENGTH: 2 << 0,
    AGILITY: 2 << 1,
    INTELLECT: 2 << 2,
    WISDOM: 2 << 3,
    ENDURANCE: 2 << 4,
});

export default class Attributes extends Component {
    constructor({ str = [], agi = [], int = [], wis = [], end = [] } = {}) {
        super(EnumComponentType.ATTRIBUTES, {
            [ EnumAttributeType.STRENGTH ]: new Attribute(EnumAttributeType.STRENGTH, str[ 0 ], { name: "Strength", min: str[ 1 ], max: str[ 2 ]}),
            [ EnumAttributeType.AGILITY ]: new Attribute(EnumAttributeType.AGILITY, agi[ 0 ], { name: "Agility", min: agi[ 1 ], max: agi[ 2 ]}),
            [ EnumAttributeType.INTELLECT ]: new Attribute(EnumAttributeType.INTELLECT, int[ 0 ], { name: "Intellect", min: int[ 1 ], max: int[ 2 ]}),
            [ EnumAttributeType.WISDOM ]: new Attribute(EnumAttributeType.WISDOM, wis[ 0 ], { name: "Wisdom", min: wis[ 1 ], max: wis[ 2 ]}),
            [ EnumAttributeType.ENDURANCE ]: new Attribute(EnumAttributeType.ENDURANCE, end[ 0 ], { name: "Endurance", min: end[ 1 ], max: end[ 2 ]}),
        });
    }

    get STR() {
        return this.state[ EnumAttributeType.STRENGTH ];
    }
    get AGI() {
        return this.state[ EnumAttributeType.AGILITY ];
    }
    get INT() {
        return this.state[ EnumAttributeType.INTELLECT ];
    }
    get WIS() {
        return this.state[ EnumAttributeType.WISDOM ];
    }
    get END() {
        return this.state[ EnumAttributeType.ENDURANCE ];
    }
};