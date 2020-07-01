//TODO This is just a template, LayeredCanvasNode does not exist
export default class RenderNode extends LayeredCanvasNode {
    constructor(node, { tw = 32, th = 32, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            node: node,
        });
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }
}