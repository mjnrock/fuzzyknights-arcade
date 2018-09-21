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

	ExtractMessage(packet) {
		let msg = JSON.parse(packet);

		if(msg) {
			msg = msg.Message;
			this.FuzzyKnights.Common.Message.MessageManager.Spawn(
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
		let packet = this.UpgradeMessage(packetType, msg, ...args);

		if(packet instanceof Packet) {
			this.Enqueue(packet);
		}
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

	AddClient(client){
		this.Clients.push(client);

		return this;
	}
	RemoveClient(index){
		return this.Clients.splice(index, 1);
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