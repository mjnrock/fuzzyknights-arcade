export const EnumTerrainType = {
    VOID: "VOID",
    FLOOR: "FLOOR",
    WALL: "WALL",
    DOOR: "DOOR",
};

export default class Terrain {
    constructor(type, state = {}) {
        this.type = type;
        this.state = state;
    }
};