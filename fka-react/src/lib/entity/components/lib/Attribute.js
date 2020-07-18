import Resource from "./Resource";
import { Bitwise } from "../../../hive/Helper";

export default class Attribute extends Resource {
    constructor(flag, value, { name, min, max, setter } = {}) {
        super(value, { min, max, setter });

        this.flag = flag;
        this.name = name;
    }

    hasFlag(mask) {
        return Bitwise.has(mask, this.flag);
    }
}