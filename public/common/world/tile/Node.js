import { Position } from "./../../utility/physics/Position.js";
import { Stack } from "../../utility/LinkedList.js";

class Node {
	constructor(x, y, z, entities = []) {
		this.Location = new Position(x, y, z);
		this.Entities = new Stack();
	}
}

export { Node };