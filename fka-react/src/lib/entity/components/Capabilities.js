import Component from "./Component";

export default class Capabilities extends Component {
    constructor({ current = [], library = [] } = {}) {
        super(EnumComponentType.CAPABILITIES, {
            library: new Map(library),
            current: new Map(current),
        });
    }

    use(index, ...args) {
        //TODO
    }
}