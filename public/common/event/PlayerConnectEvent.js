import EnumHandlerType from "../enum/HandlerType.js";
import EnumEventType from "../enum/EventType.js";

import { Event } from "./Event.js";

class PlayerConnectEvent extends Event {
	constructor(ip, username) {
		super(
			EnumHandlerType.PLAYER,
			EnumEventType.PLAYER_JOIN,
			{
				IP: ip,
				Username: username
			}
		);

		this.PostInit(this, arguments);
	}
}

export { PlayerConnectEvent };