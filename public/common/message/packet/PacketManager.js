class PacketManager {
	constructor(packets = []) {
		this.IsClient = false;
		this.Clients = [];	//TODO Nothing about this is actually completed yet
		this.Packets = packets;
	}

	SetClient() {
		this.IsClient = true;
		
		return this;
	}
	SetServer() {
		this.IsClient = false;
		
		return this;
	}
	IsServer() {
		return !this.IsClient;
	}

	Enqueue(packet) {
		this.Packets.push(packet);

		return this;
	}
	Dequeue() {
		if(this.Packets.length > 0) {
			return this.Packets.splice(0, 1);
		}

		return false;
	}

	SendToClient(client, packet) {

	}
	SendToAllClients(packet) {

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
}

export default new PacketManager();
export { PacketManager };