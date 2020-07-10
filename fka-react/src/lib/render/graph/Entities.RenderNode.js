import GridCanvasNode from "../../hive/GridCanvasNode";
import { EnumComponentType } from "./../../entity/components/Component";

export const EnumMessageType = {
    PAINT: "NodeEntities.Paint",
};

export default class RenderNodeEntities extends GridCanvasNode {
    constructor(node, { tw = 128, th = 128, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            node: node,
        });

        this.draw();
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0 } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        this.node.each((entity, i) => {
            const comp = entity.getComponent(EnumComponentType.POSITION);

            if((comp.x >= x) && (comp.x <= (x + w)) && (comp.y >= y) && (comp.y <= (y + h))) {
                //TODO [ 4, 0 ] should be replaced with comp.facing converted into sprite tile
                this.gTile(this.img("raccoon"), 4, 0, comp.x, comp.y);
            }
        });
        this.ctx.restore();

        this.dispatch(EnumMessageType.PAINT);
    }
}