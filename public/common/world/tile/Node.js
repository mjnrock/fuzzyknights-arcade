import { Position } from "./../../utility/physics/Position.js";
import { OrderedList } from "../../utility/OrderedList.js";

class Node {
	constructor(x, y, z, entities = []) {
		this.Location = new Position(x, y, z);
		this.Entities = new OrderedList(entities);
	}

	GetLocation() {
		return this.Location;
	}
	SetLocation(x, y, z) {
		this.Location = new Position(x, y, z);
	}

	AddEntity(entity) {
		this.Entities.Push(entity);
	}
	RemoveEntity(entity) {
		this.Entities.RemoveByValue(entity, (entity, entities) => {
			entities.filter((v) => v.UUID !== entity.UUID);
		});
	}

	GetPosition() {
		return this.Location.GetValues();
	}

	GetEntityArray() {
		return this.Entities.ToArray();
	}
}

export { Node };