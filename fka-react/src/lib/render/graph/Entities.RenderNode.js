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

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, game } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        this.node.each((entity, i) => {
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);

            if((comp.x >= x) && (comp.x <= (x + w)) && (comp.y >= y) && (comp.y <= (y + h))) {
                //  STUB
                // if(this.img("entity.beaver") && this.img("entity.rabbit")) {
                //     this.tile(entity === game.player ? this.img("entity.beaver") : this.img("entity.rabbit"), this.tw, comp.facing / 45 * this.tw, 0 * this.th, comp.x * this.tw - (this.tw / 2), comp.y * this.th - (this.th / 2));
                // }
                this.prop({ strokeStyle: "#000", lineWidth: game && entity === game.player ? 3 : 1 }).circle(comp.x * this.tw, comp.y * this.th, 29);
            }
        });
        this.ctx.restore();

        this.dispatch(EnumMessageType.PAINT);
    }
}