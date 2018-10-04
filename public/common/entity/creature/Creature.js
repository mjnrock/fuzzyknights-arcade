import EnumEntityType from "./../../enum/bitwise/EntityType";
import { Entity } from "./../Entity.js";

class Creature extends Entity {
	constructor() {
		super(EnumEntityType.CREATURE);
	}
}

export { Creature };