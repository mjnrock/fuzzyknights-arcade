import EnumPacketType from "../../enum/PacketType.js";

import { Packet } from "./Packet.js";

class PacketClient extends Packet {
	constructor(msg, clients) {
		super(EnumPacketType.CLIENT, msg);

		this.Clients = clients ? [...clients] : [];
	}
}

export { PacketClient };