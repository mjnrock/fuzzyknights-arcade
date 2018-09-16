import Neo4j from "./../ht/Helper/Neo4j";
import MessageType from "../ht/Enum/MessageType";

const DAILY_MILLISECONDS = 8.64e+7;

//TODO This is still in Proof of Concept phase and needs to be substantially refactored into proper classes and imports and such
const API = (...urls) => "/api/" + urls.join("/");
const router = (App, Drivers) => {
	const DB = new Neo4j(Drivers.Neo4j);
	DB.SetWebSocketServer(Drivers.WebSocket.getWss());

	App.post(API("feed", ":feed", "w"), function (req, res) {
		let feed = req.params.feed,
			author = req.body.author,
			payload = req.body.payload,
			timestamp = Date.now();

		DB.SendJSON(res, ...POSTFeedPost(DB, feed, author, payload, timestamp));
	});
	App.get(API("feed", ":feed", "r"), function (req, res) {
		let feed = req.params.feed,
			l = +req.query.l || 50;	// Limit

		DB.SendJSON(res, ...GETFeed(DB, feed, l));
	});

	App.get(API("validate"), function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send({
			IsActive: true,
			Message: "This is a validation message from the FuzzyKnights Graph API"
		});
	});

	App.get(API("auth"), function (req, res) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send({
			UUID: Math.random()
		});
	});

	App.ws("/ws", function (client, req) {
		client.on("connection", function(conn) {
			console.log("connected");
		});

		client.on("message", function(msg) {
			const message = JSON.parse(msg);

			//!	Debugging
			console.log(client._socket.address());
			console.log(client.clients);
			console.log(message);

			switch(message.Type) {
				case MessageType.AUTHENTICATE:
					console.log(message);
					break;
				default:
					break;
			}
		});

		client.on("close", function() {});
	});
};

//TODO Move this to a class
function GETFeed(DB, feed, limit = 250) {
	return DB.Basic("neo4j", "password", [
		`MATCH (m:Message)`,
		`WHERE m.Timestamp >= ${Date.now() - 2 * DAILY_MILLISECONDS}`,		// Minus (exactly) 48 hours
		`RETURN m`,
		`ORDER BY m.Timestamp ASC`,
		`LIMIT $limit`
	], {
		limit: limit
	});
}

//TODO Move this to a class
function POSTFeedPost(DB, feed, author, payload, timestamp) {
	return DB.Basic("neo4j", "password", [
		`MERGE (m:Message {Author: $author, Payload: $payload, Timestamp: $timestamp})`,	// MERGE here with timestamp binding for pseudo idempotency
		`RETURN m`
	], {
		author: author,
		payload: payload,
		timestamp: timestamp
	})
}

export default router;