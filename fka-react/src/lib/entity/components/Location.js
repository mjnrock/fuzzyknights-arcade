import Component, { EnumComponentType } from "./Component";

export default class Location extends Component {
    constructor({ node, x, y, facing } = {}) {
        super(EnumComponentType.LOCATION, {
            node,
            x,
            y,
            facing,
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
        };

        obj.tile.arr = [ obj.tile.x, obj.tile.y ];
        obj.tile.obj = { x: obj.tile.x, y: obj.tile.y };

        return obj;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
};