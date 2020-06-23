export const EnumTerrainType = {
    VOID: "VOID",
    STONE: "STONE",
    WALL: "WALL",
    DOOR: "DOOR",
};

export default class Terrain {
    constructor(type) {
        this.type = type;
    }
};