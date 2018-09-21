import { NewUUID } from "./../utility/Functions.js";

import EnumEntityType from "./../enum/EntityType.js";

import { IHookable } from "./IHookable.js";

class Entity extends IHookable {
	constructor(type, components = []) {
		super();
		this.PreInit(arguments);
		this.Type = type || EnumEntityType.ENTITY;
		this.Components = components;

		this.UUID = NewUUID();
		this.PostInit(this);
		console.log(`[ENTITY CREATED]: ${this.UUID}`);
	}

	Tick(time) {
		this.PreTick(this, arguments);
		this.PostTick(this, arguments);
	}
}

export { Entity };