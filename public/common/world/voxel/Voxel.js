import { Position } from "../../utility/physics/Position.js";
import { OrderedList } from "../../utility/OrderedList.js";
import { Terrain } from "../../entity/terrain/Terrain.js";

class Voxel {
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

	GetTerrain() {
		let ret = this.Entities.ToArray().filter((v) => v instanceof Terrain);

		return ret.length ? ret[0] : null;
	}

	GetPosition() {
		return this.Location.GetValues();
	}

	GetEntityArray() {
		return this.Entities.ToArray();
	}
}

export { Voxel };