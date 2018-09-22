import { NewUUID } from "./../utility/Functions.js";

import EnumEntityType from "./../enum/EntityType.js";

class Entity {
	constructor(uuid, type, components = []) {
		this.PreInit(this, arguments);
		this.Type = type || EnumEntityType.ENTITY;
		this.Components = components;

		this.UUID = uuid || NewUUID();
		this.PostInit(this, arguments);
	}

	//@ Hooks
	Tick(time) {}
	PreInit(){}
	PostInit(){}
	PreTick(){}
	PostTick(){}
}

export { Entity };