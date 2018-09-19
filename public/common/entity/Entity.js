import { NewUUID } from "./../utility/Functions.js";
import { IHookable } from "./IHookable.js";

class Entity extends IHookable {
	constructor(components = []) {
		super();
		this.PreInit(arguments);
		this.Components = components;

		this.UUID = NewUUID();
		this.PostInit(this);
	}

	Tick(time) {
		this.PreTick(this, arguments);
		console.log(`Entity [${this.UUID}]: tick`);
		this.PostTick(this, arguments);
	}
}

export { Entity };