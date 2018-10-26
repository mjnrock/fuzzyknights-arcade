import { GridXY } from "../../utility/GridXY.js";
import { Node } from "./Node.js";

class Map {
	constructor(xmax, ymax = 255) {
		this.GridXY = new GridXY(xmax, ymax, Node);
	}

	GetNode(x, y) {
		return super.Get(x, y);
	}
	SetNode(x, y, node) {
		super.Set(x, y, node);

		return this;
	}
}

export { Map };