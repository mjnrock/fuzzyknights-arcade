import Component, { EnumComponentType } from "./Component";

export const EnumDirection = {
    NORTH: 2 << 0,
    SOUTH: 2 << 1,
    EAST: 2 << 2,
    WEST: 2 << 3,
};

export default class Position extends Component {
    constructor({ node, x, y, facing = EnumDirection.SOUTH , vx = 0, vy = 0, speed = 1 } = {}) {
        super(EnumComponentType.POSITION, {
            node,
            x,
            y,
            facing,
            vx,
            vy,
            speed,
        });
    }

    get pos() {
        let obj = {
            x: this.state.x,
            y: this.state.y,
        };

        obj.arr = [ obj.x, obj.y ];
        obj.obj = { x: obj.x, y: obj.y };

        obj.tile = {
            x: Math.floor(this.state.x),
            y: Math.floor(this.state.y),
            vx: this.state.vx,
            vy: this.state.vy,
            speed: this.state.speed,
        };

        obj.tile.arr = [ obj.tile.x, obj.tile.y ];
        obj.tile.obj = { x: obj.tile.x, y: obj.tile.y };

        return obj;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    setVelocity(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }
    addVelocity(vx = 0, vy = 0) {
        this.vx += vx;
        this.vy += vy;
    }
    multiplyVelocity(vx = 1, vy = 1) {
        this.vx *= vx;
        this.vy *= vy;
    }
    resetVelocity() {
        this.setVelocity(0, 0);
    }
};