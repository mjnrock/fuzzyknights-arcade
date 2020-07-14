import Component from "./Component";
import { EnumEventType as EnumGraphEventType } from "./../../graph/Graph";
import { EnumMessageType as EnumMouseMessageType } from "./../../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../../hive/KeyNode";

export default class GraphComponent extends Component {
    constructor(graph, { x, y, width = 1, height = 1 } = {}) {
        super({ x, y, width, height });

        this.graph = graph;

        this.on(EnumGraphEventType.PLAYER_MOVEMENT_MASK, this.graph.onPlayerMovementMask.bind(this.graph));
        this.on(EnumGraphEventType.PLAYER_FACING, this.graph.onPlayerFacing.bind(this.graph));
    }

    get() {
        return this.graph;
    }
    set(graph) {
        this.graph = graph;
    }

    receive(state, msg) {
        if(msg.type === EnumKeyMessageType.KEY_MASK) {
            this.emit(EnumGraphEventType.PLAYER_MOVEMENT_MASK, msg.payload);
        } else if(msg.type === EnumMouseMessageType.MOUSE_MOVE) {
            this.emit(EnumGraphEventType.PLAYER_FACING, msg.payload);
        }
    }
};