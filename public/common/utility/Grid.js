class Grid {
	/**
	 * @param int width | Grid width
	 * @param int height | Grid height
	 * @param int type | The "instanceof {type}" or "typeof value === {type}" of the Type to enforce safe Sets
	 */
	constructor(width, height, type) {
		this.Width = width;
		this.Height = height;
		this.Type = type;

		this.Elements = [];
		for(let y = 0; y < height; y++) {
			this.Elements.push([]);
			for(let x = 0; x < width; x++) {
				this.Elements[y].push(null);
			}
		}
	}

	/**
	 * @param any value | The value to search for
	 * @param function(value, this.Elements, this) comparator | A custom comparator function that should return TRUE or FALSE, otherwise the result will be implicitly converted to BOOLEAN anyway
	 * @returns obj//false | X, Y, Value found // FALSE
	 */
	Find(search, comparator = null) {
		for(let y = 0; y < height; y++) {
			for(let x = 0; x < width; x++) {
				if(this.Elements[y][x] === search) {
					return {
						X: x,
						Y: y,
						Value: this.Elements[y][x]
					};
				} else if(comparator && typeof comparator === "function") {
					if(comparator(search, this.Elements, this)) {
						return {
							X: x,
							Y: y,
							Value: this.Elements[y][x]
						};
					}
				}
			}
		}

		return false;
	}

	Get(x, y) {
		return this.Elements[y][x];
	}
	Set(x, y, value) {
		if(value instanceof this.Type || typeof value === this.Type) {
			this.Elements[y][x] = value;
		}

		return this;
	}

	Remove(x, y) {
		this.Elements[y][x] = null;

		return this;
	}

	IsEmpty(x, y) {
		return this.Elements[y][x] === null || this.Elements[y][x] === void 0;
	}
}

export { Grid };