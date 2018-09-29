import EnumPacketType from "../../enum/PacketType.js";

import { Packet } from "./Packet.js";

class PacketClient extends Packet {
	constructor(msg, sender) {
		super(EnumPacketType.CLIENT, msg, sender);
	}
}

export { PacketClient };