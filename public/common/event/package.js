import { Event } from "./Event.js";
import { PlayerConnectEvent } from "./PlayerConnectEvent.js";
import { EntityDamageEvent } from "./EntityDamageEvent.js";
import { EntityMoveEvent } from "./EntityMoveEvent.js";

import Handler from "./handler/package.js";

export default {
	Event,
	PlayerConnectEvent,
	EntityDamageEvent,
	EntityMoveEvent,

	Handler,

	Spawn: {
		Event: (...args) => new Event(...args),
		PlayerConnectEvent: (...args) => new PlayerConnectEvent(...args),
		EntityDamageEvent: (...args) => new EntityDamageEvent(...args),
		EntityMoveEvent: (...args) => new EntityMoveEvent(...args)
	}
};