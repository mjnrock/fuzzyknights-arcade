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
	SpawnServer(msg, ...args) {
		return this.Spawn(EnumPacketType.SERVER, msg, ...args);
	}
	SpawnClient(msg, ...args) {
		return this.Spawn(EnumPacketType.CLIENT, msg, ...args);
	}
	SpawnBroadcast(msg, ...args) {
		return this.Spawn(EnumPacketType.BROADCAST, msg, ...args);
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

	SendToClient(packet, uuid) {
		
	}
	SendToAllClients(packet) {
		if(this.FuzzyKnights.IsServer) {
			this.FuzzyKnights.Server.WebSocket.clients.forEach((client) => {
				client.send(JSON.stringify(packet));
			});
		}
	}
	SendToServer(packet) {
		this.FuzzyKnights.Server.WebSocket.send(JSON.stringify(packet));
	}
	
	Dispatch(packet, time = null) {
		if(this.FuzzyKnights.IsServer) {
			console.log(`[PACKET DISPATCHED]: ${packet.PacketType}`);
		} else {
			console.log(`[PACKET DISPATCHED]: ${packet.PacketType}`, packet);
		}

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