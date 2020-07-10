import Hive from "@lespantsfancy/hive";

export default class Game extends Hive.Node {
    constructor() {
        super({
            players: [],
            graph: null,
            view: null,
        });        
    }

    get player() {
        return this.state.players[ 0 ];
    }
    set player(player) {
        this.state.player[ 0 ] = player;
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