import Game from "./../../Game";
import Component from "./Component";
import { EnumMessageType as EnumMouseMessageType } from "./../../hive/MouseNode";
import { EnumMessageType as EnumKeyMessageType } from "./../../hive/KeyNode";
import { Bitwise } from "./../../hive/Helper";
import { EnumMoveDirection } from "./../../hive/KeyNode";
import { EnumComponentType } from "./../../entity/components/Component";

export const EnumEventType = {
    PLAYER_FACING: "PLAYER_FACING",
    PLAYER_MOVEMENT_MASK: "PLAYER_MOVEMENT_MASK",
};

export default class GraphComponent extends Component {
    constructor(graph, { x, y, width = 1, height = 1 } = {}) {
        super({ x, y, width, height });

        this.graph = graph;
    }

    get() {
        return this.graph;
    }
    set(graph) {
        this.graph = graph;
    }


    receive(state, msg) {
        if(msg.type === EnumKeyMessageType.KEY_MASK) {
            this.onPlayerMovementMask.call(this.graph, msg.payload, state);
        } else if(msg.type === EnumMouseMessageType.MOUSE_MOVE) {
            this.onPlayerFacing.call(this.graph, msg.payload, state);
        }
    }


    onPlayerFacing({ x, y, tx, ty } = {}, state) {
        const comp = Game.$.player.getComponent(EnumComponentType.RIGID_BODY);

        let theta = Math.atan2(ty - comp.y, tx - comp.x) * 180 / Math.PI + 90;
        if(theta < 0) {
            theta += 360;
        }
        theta = Math.round(theta / 45.0) * 45.0;

        if(theta % 360 === 0) {
            comp.facing = 0;
        } else {
            comp.facing = theta;
        }

        Game.$.send("graph", this, EnumEventType.PLAYER_FACING, Game.$.player, ...arguments);
    }

    onPlayerMovementMask({ map, mask } = {}, state) {
        const comp = Game.$.player.getComponent(EnumComponentType.RIGID_BODY);
        const factor = 0.75;

        if(Bitwise.has(mask, map[ EnumMoveDirection.UP ]) && Bitwise.has(mask, map[ EnumMoveDirection.RIGHT ])) {
            comp.vy = -comp.speed * factor;
            comp.vx = comp.speed * factor;
            comp.facing = 45;
        } else if(Bitwise.has(mask, map[ EnumMoveDirection.UP ]) && Bitwise.has(mask, map[ EnumMoveDirection.LEFT ])) {
            comp.vy = -comp.speed * factor;
            comp.vx = -comp.speed * factor;
            comp.facing = 315;
        } else if(Bitwise.has(mask, map[ EnumMoveDirection.DOWN ]) && Bitwise.has(mask, map[ EnumMoveDirection.RIGHT ])) {
            comp.vy = comp.speed * factor;
            comp.vx = comp.speed * factor;
            comp.facing = 135;
        } else if(Bitwise.has(mask, map[ EnumMoveDirection.DOWN ]) && Bitwise.has(mask, map[ EnumMoveDirection.LEFT ])) {
            comp.vy = comp.speed * factor;
            comp.vx = -comp.speed * factor;
            comp.facing = 225;
        } else {
            if(Bitwise.has(mask, map[ EnumMoveDirection.UP ])) {
                comp.vy = -comp.speed;
                comp.facing = 0;
            } else if(Bitwise.has(mask, map[ EnumMoveDirection.DOWN ])) {
                comp.vy = comp.speed;
                comp.facing = 180;
            } else {
                comp.vy = 0;
            }
    
            if(Bitwise.has(mask, map[ EnumMoveDirection.LEFT ])) {
                comp.vx = -comp.speed;
                comp.facing = 270;
            } else if(Bitwise.has(mask, map[ EnumMoveDirection.RIGHT ])) {
                comp.vx = comp.speed;
                comp.facing = 90;
            } else {
                comp.vx = 0;
            }
        }

        Game.$.send("graph", this, EnumEventType.PLAYER_MOVEMENT_MASK, Game.$.player, ...arguments);
    }
};