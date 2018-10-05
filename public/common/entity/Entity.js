import { NewUUID } from "../utility/Functions.js";

class Entity {
	constructor(type, components = []) {
		this.Type = type;
		this.SubType = this.constructor.name;
		this.UUID = NewUUID();

		this.Components = components;

		//TODO Add anything that ALL entities should have here (e.g. Position, Physics, etc.).  Treat this class like the VOXEL/TENSOR class in brainstorming.  "Entities", per se, are of type CREATURE.
	}
}

export { Entity };