import Hive from "@lespantsfancy/hive";
import { v4 as uuidv4 } from "uuid";
import Propagator from "./Propagator";

export default class Station extends Hive.Node {
    constructor({ channels = [], state  = {}, config = {} } = {}) {
        super({
            channels: new Map(channels),         

            ...state,
        });

        this.id = uuidv4();

        this.mergeConfig({            
            ...config,
        });
    }

    get channels() {
        return this.state.channels;
    }
    set channels(channels = {}) {
        this.mergeState({
            ...channels,
        });
    }

    newChannel(name, { subscribors = [] } = {}) {
        const channel = new Propagator({ subscribors });

        this.channels.set(name, channel);
    }
    getChannel(name) {
        return this.channels.get(name);
    }
    setChannel(name, channel) {
        if(channel instanceof Propagator) {
            return this.channels.set(name, channel);
        }
    }

    broadcast(thisArg, ...args) {
        for(let channel of this.channels.values()) {
            channel.invoke(thisArg, ...args);
        }

        return this;
    }

    invoke(thisArg, channelName, type, ...args) {
        const channel = this.channels.get(channelName);

        if(channel instanceof Propagator) {
            channel.invoke(thisArg, type, ...args);
        }

        return this;
    }

    subscribors(channelName) {
        const channel = this.channels.get(channelName);

        if(channel instanceof Propagator) {
            return channel.subscribors;
        }

        return [];
    }

    join(channel, fn) {
        if(typeof fn === "function") {
            this.channels.get(channel).add(fn);
        }
    }
    leave(channel, fn) {
        this.channels.get(channel).delete(fn);
    }
}