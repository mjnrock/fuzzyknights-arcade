import EnumPacketType from "./../../enum/PacketType.js";

import { Packet } from "./Packet.js";

class PacketServer extends Packet {
	constructor(msg) {
		super(EnumPacketType.SERVER, msg);
	}
}

export { PacketServer };