import Hive from "@lespantsfancy/hive";

export default class Game extends Hive.Node {
    constructor({ settings = {} } = {}) {
        super({
            players: [],
            graph: null,
            view: null,

            settings: {
                isDebugMode: true,

                ...settings,
            },
        });        
    }

    setting(prop, value) {
        if(prop in this.state.settings) {
            if(value !== void 0) {
                this.state.settings[ prop ] = value;
            }

            return this.state.settings[ prop ];
        }
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
}