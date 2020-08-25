import Component, { EnumComponentType } from "./Component";
import Equipment from "../../item/Equipment";
import Inventory from "../../item/Inventory";

export default class Storage extends Component {
    constructor() {
        super(EnumComponentType.STORAGE, {
            bags: new Inventory(4),
            equipment: new Equipment(),
        });
    }
}