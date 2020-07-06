import GridCanvasNode from "../../hive/GridCanvasNode";

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

    draw() {
        this.node.each((entity, i) => {
            this.gTile(this.img("raccoon"), 4, 0, 5, 5);
        });

        this.dispatch(EnumMessageType.PAINT);
    }
}