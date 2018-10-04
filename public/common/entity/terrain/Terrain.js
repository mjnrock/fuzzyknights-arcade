import EnumEntityType from "../../enum/bitwise/EntityType";
import { Entity } from "../Entity";

class Terrain extends Entity {
	constructor() {
		super(EnumEntityType.TERRAIN);
	}
}

export { Terrain };