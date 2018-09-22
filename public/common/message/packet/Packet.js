class Packet {
	constructor(packetType, msg, sender = null) {
		this.PacketType = packetType;
		this.Message = msg;
		this.Sender = sender;

		this.Timestamp = Date.now();
	}
}

export { Packet };