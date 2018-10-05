class Transformer {
	constructor(fk) {
		this.FuzzyKnights = fk;
	}

	GetComponent(entity, type) {
		let comp = entity.Components.filter((v) => v.Type = type);

		return comp[0] ? comp[0] : comp;
	}
}

export { Transformer };