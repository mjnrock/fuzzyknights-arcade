import Model from "./Model";

export default class Rectangle extends Model {
    constructor(width, height) {
        super();

        this.width = width;
        this.height = height;
    }

    // hasCollision(model) {
    //     if(model instanceof Rectangle) {
    //         if(model.x > this.x + this.width || this.x > model.x + model.width || model.y > this.y + this.height || this.y > model.y + model.height) {
    //             return false;
    //         }

    //         return true;
    //     }
    // }
};