import EnumEntityType from "../../enum/bitwise/EntityType.js";
import { Entity } from "../Entity.js";

class Terrain extends Entity {
	constructor() {
		super(EnumEntityType.TERRAIN);
	}
}

export { Terrain };