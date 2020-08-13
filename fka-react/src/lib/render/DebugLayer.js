import GridCanvasNode from "../hive/GridCanvasNode";
import { EnumComponentType } from "./../entity/components/Component";
import RigidBody from "./../entity/components/RigidBody";
import Models from "./../model/package";

export default class EntityLayer extends GridCanvasNode {
    constructor({ width, height, tw = 128, th = 128, size = [] } = {}) {
        super({
            width: width,
            height: height,
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });
    }

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, node, game } = {}) {
        this.clear();        

        if(game.setting("isDebugMode")) {
            this.ctx.save();
            this.ctx.scale(scale, scale);

            node.apply((tx, ty, tile) => {
                if(tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
                    this.prop({
                        strokeStyle: "#0f0",
                    }).gRect(tx, ty, this.tw, this.th);
                }
            });
            
            node.each((entity, i) => {
                const rb = entity.getComponent(EnumComponentType.RIGID_BODY);

                if((rb.x >= x) && (rb.x <= (x + w)) && (rb.y >= y) && (rb.y <= (y + h))) {
                    if(rb.model instanceof Models.Arc) {
                        this.prop({
                            strokeStyle: "#0ff",
                        }).circle(rb.x * this.tw, rb.y * this.th, rb.model.radius);
                    }

                    if(rb.isColliding) {
                        this.prop({
                            strokeStyle: "#f00",
                        });
                    } else {
                        this.prop({
                            strokeStyle: "#0f0",
                        });
                    }
                    
                    // Cener of Mass point
                    this.point(rb.x * this.tw, rb.y * this.th);
                    
                    if(rb.model instanceof Models.Circle) {
                        this.circle(rb.x * this.tw, rb.y * this.th, rb.model.radius + 2);
                    } else if(rb.model instanceof Models.Arc) {
                        // The 90 degree rotation is to accommodate the DOM x,y coordination system
                        this.arc(rb.x * this.tw, rb.y * this.th, rb.model.radius, ...this.degToRad(rb.model.left, rb.model.right));

                        const tps = rb.model.getTriangle(rb.x * this.tw, rb.y * this.th, { rotation: -90 });
                        this.triangle(...tps);
                    } else if(rb.model instanceof Models.Triangle) {
                        const tps = rb.model.getTriangle(rb.x * this.tw, rb.y * this.th);
                        this.triangle(...tps);
                    } else if(rb.model instanceof Models.Line) {
                        const lps = rb.model.getLine(rb.x * this.tw, rb.y * this.th);
                        this.line(...lps);
                    }

                    const { x, y } = RigidBody.FacingToXY(rb.facing);
                    const factor = 0.4;

                    this.prop({ strokeStyle: "#00f" }).line(rb.x * this.tw, rb.y * this.th, (rb.x + (x * factor)) * this.tw, (rb.y + (y * factor)) * this.th);
                }
            });
            this.ctx.restore();
        }
    }
}