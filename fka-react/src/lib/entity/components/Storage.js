import Component, { EnumComponentType } from "./Component";
import Equipment from "../../item/Equipment";
import Inventory from "../../item/Inventory";

//TODO Create either chain hashing or event listener system to trigger a rehash here, indicating that the inventory state has changed
export default class Storage extends Component {
    constructor() {
        super(EnumComponentType.STORAGE, {
            bags: new Inventory(4),
            equipment: new Equipment(),
        });
    }
}