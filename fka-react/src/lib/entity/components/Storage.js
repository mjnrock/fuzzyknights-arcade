import Component from "./Component";
import Equipment from "../../item/Equipment";

export default class Storage extends Component {
    constructor() {
        super(EnumComponentType.STORAGE, {
            bags: new Map(bags),
            equipment: new Equipment(),
        });
    }
}