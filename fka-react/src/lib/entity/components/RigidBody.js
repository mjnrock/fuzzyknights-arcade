import Component, { EnumComponentType } from "./Component";

export const EnumDirection = {
    NORTH: 2 << 0,
    SOUTH: 2 << 1,
    EAST: 2 << 2,
    WEST: 2 << 3,
};

export default class RigidBody extends Component {
    constructor({ node, x = 1, y = 0, facing = 0, vx = 0, vy = 0, speed = 1, model, mass } = {}) {
        super(EnumComponentType.RIGID_BODY, {
            node,
            facing,
            x,
            y,
            vx,
            vy,
            speed,
            model,
            mass,
            isColliding: false,
        });
    }

    static FacingToXY(facing) {
        let x = Math.sin(facing * Math.PI / 180),
            y = Math.cos(facing * Math.PI / 180);

        if(x < 0.001 && x > -0.001) {
            x = 0;
        } else if(x > 0) {
            x = 1;
        } else if(x < 0) {
            x = -1;
        } else {
            x = 0;
        }

        if(y < 0.001 && y > -0.001) {
            y = 0;
        } else if(y > 0) {
            y = -1;
        } else if(y < 0) {
            y = 1;
        } else {
            y = 0;
        }

        return {
            x,
            y,
        };
    }

    facingXY(asArray = false) {
        const res = RigidBody.FacingToXY(this.facing);
        
        if(asArray === true) {
            return [ res.x, res.y ];
        }

        return res;
    }

    get pos() {
        return {
            x: this.state.x,
            y: this.state.y,
        };
    }

    get info() {
        let obj = {
            x: this.state.x,
            y: this.state.y,
            facing: this.state.facing,
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