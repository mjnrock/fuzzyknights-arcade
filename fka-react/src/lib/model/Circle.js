import Model from "./Model";

export default class Circle extends Model {
    constructor(radius) {
        super();

        this.radius = radius;
    }

    // hasIntersection(model) {
    //     if(model instanceof Circle) {
    //         return Math.pow(this.x - model.x, 2) + Math.pow(this.y - model.y, 2) <= Math.pow(this.radius + model.radius, 2);
    //     }
    // }
};