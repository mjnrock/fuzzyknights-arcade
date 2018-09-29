import EnumHandlerType from "../enum/HandlerType.js";
import EnumEventType from "../enum/EventType.js";

import { Event } from "./Event.js";

class EntityDamageEvent extends Event {
	constructor(target, source, damage) {
		super(
			EnumHandlerType.ENTITY,
			EnumEventType.ENTITY_DAMAGE,
			{
                Target: target,
                Source: source,
                Damage: damage
			}
		);

		this.Init(...arguments);
	}

	Init(args) {
		EntityDamageEvent.MANAGER.onEntityDamageEvent(this, args);
	}
}

export { EntityDamageEvent };