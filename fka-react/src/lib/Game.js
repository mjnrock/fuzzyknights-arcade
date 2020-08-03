import Hive from "@lespantsfancy/hive";
import Station from "./hive/Station";
import Propagator from "./hive/Propagator";
import GameLoop from "./GameLoop";

export const ChannelManifest = [
    new Propagator()
];

export default class Game extends Hive.Node {
    constructor({ settings = {}, fps = 60 } = {}) {
        super({
            players: [],
            graph: null,
            view: null,
            broadcastNetwork: new Station(ChannelManifest),
            loop: null,

            settings: {
                isDebugMode: true,
                showNameplates: true,

                ...settings,
            },
        });

        this.state.loop = new GameLoop(this, fps);

        this.state.broadcastNetwork.newChannel("graph");
        this.state.broadcastNetwork.newChannel("node");
        this.state.broadcastNetwork.newChannel("player");
        this.state.broadcastNetwork.newChannel("entity");
    }

    setting(prop, value) {
        if(prop in this.state.settings) {
            if(value !== void 0) {
                this.state.settings[ prop ] = value;
            }

            return this.state.settings[ prop ];
        }
    }

    start() {
        this.state.loop.start();

        return this;
    }
    stop() {
        this.state.loop.stop();

        return this;
    }

    get player() {
        return this.state.players[ 0 ];
    }
    set player(player) {
        this.state.players.splice(0, 1, player);
    }

    get graph() {
        return this.state.graph;
    }
    set graph(graph) {
        this.state.graph = graph;
    }

    get view() {
        return this.state.view;
    }
    set view(view) {
        this.state.view = view;
    }

    get broadcastNetwork() {
        return this.state.broadcastNetwork;
    }
    set broadcastNetwork(broadcastNetwork) {
        return this.state.broadcastNetwork = broadcastNetwork;
    }

    channel(name) {
        return this.state.broadcastNetwork.getChannel(name);
    }

    send(channelName, thisArg, type, ...args) {
        this.channel(channelName).invoke(thisArg, type, ...args);

        return this;
    }
    broadcast(thisArg, ...args) {
        this.broadcastNetwork.broadcast(thisArg, ...args);

        return this;
    }
}