import WebSocketHelper from "./WebSocketHelper.js";
import ConnectionClient from "./ConnectionClient.js";

import Event from "./event/package.js";
import Enum from "./enum/package.js";
import Render from "./render/package.js";

export default {
	WebSocketHelper,
	ConnectionClient,

	Event,
	Enum,
	Render
};


//	Import, pass initial parameters example
// // module.js
// export default function(options) {
//     return {
//         // actual module
//     }
// }

// // main.js
// import m from 'module';
// var x = m(someoptions);