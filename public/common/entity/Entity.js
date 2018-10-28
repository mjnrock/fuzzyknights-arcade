import { NewUUID } from "../utility/Functions.js";
import { States } from "./../component/States.js";
import EnumStateType from "./../component/enum/StateType.js";

class Entity {
	constructor(type, components = []) {
		this.Type = type;
		this.SubType = this.constructor.name;
		this.UUID = NewUUID();

		this.Components = [
			new States([
				[EnumStateType.ACTION, 0],
				[EnumStateType.MOVEMENT, 0]
			]),
			...components
		];

		//TODO Add anything that ALL entities should have here (e.g. Position, Physics, etc.).  Treat this class like the VOXEL/TENSOR class in brainstorming.  "Entities", per se, are of type CREATURE.
	}

	Tick(time) {
		console.log("Entity - Tick", this.UUID, time);
	}
}

export { Entity };