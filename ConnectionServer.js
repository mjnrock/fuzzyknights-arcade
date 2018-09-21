const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressWS = require("express-ws")(express());
const app = expressWS.app;

const PORT = 1337;
const STDIN = process.openStdin();

import * as util from "util";
import FuzzyKnightsCommon from "./public/common/FuzzyKnightsCommon";
const FuzzyKnights = (new FuzzyKnightsCommon()).GetFuzzyKnights();

FuzzyKnights.IsServer = true;
FuzzyKnights.Server = {
	Main: app,
	WebSocket: expressWS.getWss()
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
			case "AUTHENTICATE":
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


//DEBUG
setInterval(() => {
	console.log("ConnectionServer.js:62 | setInterval Active");
	let e = new FuzzyKnights.Common.Entity.EntityCat();
}, 1500);


//  Console Command Parser
// let commands = [],
// 	index = 0;
STDIN.addListener("data", function(d) {
	let args = d.toString().trim().replace(/^\s+|\s+$/g, '').split(" ");
	if(args[0] === "get" || args[0].substr(0, 1) === "$") {
		
		if(args[0] !== null && args[0] !== void 0) {
			console.log(util.inspect(eval(args[0].replace("$", "FuzzyKnights"))));
		} else if(args[1] !== null && args[1] !== void 0) {
			console.log(util.inspect(eval(args[1].replace("$", "FuzzyKnights"))));
		}
	} else if(args[0] === "ticks") {
		console.log(JSON.stringify(FuzzyKnights.Common.Game.GameLoop.GetInfo(), null, 2));
	} else if(args[0] === "exit") {
		//  Kill the current Node instance
		process.exit();
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