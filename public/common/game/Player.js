class Player {
	constructor(name, entity) {
		this.Name = name;
		this.Entity = entity;
	}

	GetName() {
		return this.name;
	}
	SetName(name) {
		this.Name = name;

		return this;
	}

	GetEntity() {
		return this.Entity;
	}
	SetEntity(entity) {
		this.Entity = entity;

		return this;
	}
}

export { Player };