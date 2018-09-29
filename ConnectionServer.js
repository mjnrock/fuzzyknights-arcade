const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1337;
const STDIN = process.openStdin();

import * as util from "util";
import FuzzyKnightsCommon from "./public/common/FuzzyKnightsCommon";
import { PlayerConnectMessage } from "./public/common/message/PlayerConnectMessage";
const FuzzyKnights = (new FuzzyKnightsCommon()).GetFuzzyKnights();

FuzzyKnights.IsServer = true;
FuzzyKnights.Server = {
	Main: app,
	WebSocket: expressWS.getWss(),
	UUID: FuzzyKnights.Common.Utility.Functions.NewUUID()
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(express.static(path.join(__dirname, "public")));

app.ws("/ws", function (client, req) {
	console.log(`[CLIENT CONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
	client.UUID = FuzzyKnights.Common.Utility.Functions.NewUUID();

	//TODO Rewrite these kinds of packets to a special condition on the client, as the PacketManager won't be loaded yet on the Client and thus throws an error
	let _pkt = new FuzzyKnights.Common.Message.PlayerConnectMessage(client.UUID);
	client.send(JSON.stringify(_pkt));

	client.on("message", function(msg) {
		try {
			const packet = JSON.parse(msg);

			//!	Debugging
			// console.log(client._socket.address());
			// console.log(client.clients);
			console.log(`[PACKET RECEIVED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);

			if(packet["Message"] !== null && packet["Message"] !== void 0) {
				FuzzyKnights.Common.Message.MessageManager.Receive(packet.Message);
			}
		} catch (e) {
			console.log("[PACKET FAILURE]: Message could not be extracted");
			console.log(e);
		}
	});

	client.on("close", function() {
		console.log(`[CLIENT DISCONNECTED]: { Timestamp: ${Date.now()}, IP: ${req.connection.remoteAddress} }`);
	});
});

app.listen(PORT, () => {
	console.log(`FuzzyKnights API is now listening on port: ${PORT}`);
});

//?		Replace the contents of this function, as necessary
function RunTestCase(iterations = 1) {
	for(let i = 0; i < iterations; i++) {
		//*	--REPLACE START--
		
		new FuzzyKnights.Common.Entity.EntityCat();

		//*	--REPLACE END--
	}
}

//?		get Object.keys($.Common.Entity.EntityManager.Entities)
STDIN.addListener("data", function(d) {
	let args = d.toString().trim().replace(/^\s+|\s+$/g, '').split(" ");
	if(args[0] === "get") {
		if(args[1] !== null && args[1] !== void 0) {
			try {
				let obj = args[1].replace("$", "FuzzyKnights");
				console.log(util.inspect(eval(obj)));
			} catch (e) {
				console.log("[WARNING]: Invalid command.");
			}
		}
	} else if(args[0] === "ticks") {
		console.log(JSON.stringify(FuzzyKnights.Common.Game.GameLoop.GetInfo(), null, 2));
	} else if(args[0] === "exit") {
		//  Kill the current Node instance
		process.exit();
	} else if(args[0] === "t" || args[0] === "test") {		
		RunTestCase(args[1] ? args[1] : 1);
	} else if(args[0] === "eval") {
		if(args.length > 1) {
			let input = args.slice(1).join(" ");
			try {
				let result = eval(input);
	
				if(result !== void 0) {
					console.log(result);
				}
			} catch (e) {
				console.log("[WARNING]: Invalid command.");
			}
		}
	}
	// console.log(`[PREVIOUS COMMAND]: ${args.join(" ")}`);
});