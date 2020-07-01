import GridCanvasNode from "./hive/GridCanvasNode";

export const EnumEventType = {};

export default class RenderEntity extends GridCanvasNode {
    constructor(entity, model) {
        this.entity = entity;
        this.model = model;
    }
};