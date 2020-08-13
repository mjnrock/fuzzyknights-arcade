export const EnumTerrainType = {
    VOID: "VOID",
    FLOOR: "FLOOR",
    WALL: "WALL",
    DOOR: "DOOR",
};

//TODO Add "Collidiability" flags or "collision level"--rather than straight booleans--so that dynamic events can override them (e.g. water-walking boots)
export default class Terrain {
    constructor(type, state = {}) {
        this.type = type;
        this.state = state;
    }
};