import EnumPacketType from "../../enum/PacketType.js";

import { Packet } from "./Packet.js";

class PacketBroadcast extends Packet {
	constructor(msg) {
		super(EnumPacketType.BROADCAST, msg);
	}
}

export { PacketBroadcast };