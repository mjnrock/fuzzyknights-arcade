class Terrain {
	constructor(type, nav, mask = 0) {
		this.Type = type;
		this.Navigability = nav;
		this.VariationMask = mask;
	}
}

export { Terrain };