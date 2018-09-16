const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(path.join(__dirname, "public")));

app.ws("/ws", function (client, req) {
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

app.listen(PORT, () => {
	console.log(`FuzzyKnights API is now listening on port: ${PORT}`);
});