class Packet {
	constructor(packetType, msg) {
		this.PacketType = packetType;
		this.Message = msg;

		this.Timestamp = Date.now();
	}
}

export { Packet };