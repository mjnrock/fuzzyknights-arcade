import GridCanvasNode from "../hive/GridCanvasNode";

export const EnumEventType = {};

export default class RenderEntity extends GridCanvasNode {
    constructor(entity, { state = {}, config = {}, width, height, size } = {}) {
        super({ state, config, width, height, size });

        this.entity = entity;
    }
};