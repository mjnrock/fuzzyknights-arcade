import { Coordinate } from "./../Coordinate.js";

class TileNode {
	constructor(terrain, ...coords) {
		this.Terrain = terrain;

		if(coords.length === 1 && coords[0] instanceof Coordinate) {
			this.Coordinate = coords[0];
		} else if(coords.length === 2 || coords.length === 3) {
			this.Coordinate = new Coordinate(...coords);
		}
	}
}

export { TileNode };