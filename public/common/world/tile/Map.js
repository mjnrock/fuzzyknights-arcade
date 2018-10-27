import { GridXY } from "../../utility/GridXY.js";
import { Node } from "./Node.js";

class Map {
	constructor(xmax, ymax) {
		this.Grid = new GridXY(xmax, ymax, Node, (x, y, t) => {
			return [x, y];
		});

		this.HasCreatures = false;
	}

	GetNode(x, y) {
		return this.Grid.Get(x, y);
	}
	SetNode(x, y, node) {
		this.Grid.Set(x, y, node);

		return this;
	}

	/**
	 * This will check each node in the Grid and call .RemoveEntity()
	 * @param Entity entity 
	 */
	DeepRemove(entity) {
		this.Grid.ForEach((p, n, t) => {
			n.RemoveEntity(entity);
		});

		return this;
	}

	IsOccupied() {
		this.Grid.ForEach((p, e, t) => {
			console.log(e.IsOccupied());
			// this.HasCreatures = this.HasCreatures || e.IsOccupied();
		});

		return this.HasCreatures;
	}

	MoveEntity(entity, x0, y0, x1, y1) {
		let n0 = this.GetNode(Math.floor(x0), Math.floor(y0)),
			n1 = this.GetNode(Math.floor(x1), Math.floor(y1));

		n0.RemoveEntity(entity);
		n1.AddEntity(entity);

		return this;
	}
}

export { Map };