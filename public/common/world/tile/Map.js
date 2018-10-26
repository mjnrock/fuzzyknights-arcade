import { GridXY } from "../../utility/GridXY.js";
import { Node } from "./Node.js";

class Map {
	constructor(xmax, ymax) {
		this.Grid = new GridXY(xmax, ymax, Node);
	}

	GetNode(x, y) {
		return super.Get(x, y);
	}
	SetNode(x, y, node) {
		super.Set(x, y, node);

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
	}

	MoveEntity(entity, x0, y0, x1, y1) {
		let n0 = this.GetNode(x0, y0),
			n1 = this.GetNode(x1, y1);

		n0.RemoveEntity(entity);
		n1.AddEntity(entity);
	}
}

export { Map };