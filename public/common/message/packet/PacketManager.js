import EnumPacketType from "./../../enum/PacketType.js";

import { Packet } from "./Packet.js";
import { PacketServer } from "./PacketServer.js";
import { PacketClient } from "./PacketClient.js";
import { PacketBroadcast } from "./PacketBroadcast.js";

class PacketManager {
	constructor(fk, packets = []) {
		this.FuzzyKnights = fk;
		this.Packets = packets;
	}
	
	ExtractMessage(pkt) {
		let packet = JSON.parse(pkt);

		if(packet) {
			let msg = packet.Message;

			return this.FuzzyKnights.Common.Message.MessageManager.Spawn(
				msg.MessageType,
				msg.EventType,
				msg.Payload
			);
		}
	}

	UpgradeMessage(packetType, msg, ...args) {
		switch(packetType) {
			case EnumPacketType.SERVER:
				return new PacketServer(msg);
			case EnumPacketType.CLIENT:
				return new PacketClient(msg, ...args);
			case EnumPacketType.BROADCAST:
				return new PacketBroadcast(msg);
			default:
				return null;
		}
	}
	
	Spawn(packetType, msg, ...args) {
		return this.Receive(this.UpgradeMessage(packetType, msg, ...args));
	}

	Receive(packet) {
		if(packet instanceof Packet) {
			this.Enqueue(packet);

			return packet;
		}

		return false;
	}

	Enqueue(packet) {
		this.Packets.push(packet);

		return this;
	}
	Dequeue() {
		if(this.Packets.length > 0) {
			return this.Packets.splice(0, 1)[0];
		}

		return false;
	}

	SendToClient(packet, client) {

	}
	SendToAllClients(packet) {
		if(this.FuzzyKnights.IsServer) {
			this.FuzzyKnights.Server.WebSocket.clients.forEach((client) => {
				client.send(JSON.stringify(packet));
			});
		}
	}
	SendToServer(packet) {

	}
	
	Dispatch(packet, time = null) {
		switch(packet.PacketType) {
			case EnumPacketType.SERVER:
				this.SendToServer(packet);
				return true;
			case EnumPacketType.CLIENT:
				this.SendToClient(packet, packet.Clients);
				return true;
			case EnumPacketType.BROADCAST:
				this.SendToAllClients(packet);
				return true;
			default:
				return false;
		}
	}

	Tick(time) {
		let start = Date.now(),
			timeout = 2000;

		while(this.Packets.length > 0 || (Date.now() - start >= timeout)) {
			this.Dispatch(this.Dequeue(), time);
		}
	}
}

export default PacketManager;