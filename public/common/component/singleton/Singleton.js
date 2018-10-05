class Singleton {
	constructor(type) {
		this.Type = type;
	}

	GetType() {
		return this.Type;
	}
}

export { Singleton };