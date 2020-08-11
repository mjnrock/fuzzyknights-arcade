import GridCanvasNode from "../../../lib/hive/GridCanvasNode";
import { EnumComponentType } from "../../../lib/entity/components/Component";

import Models from "../../../lib/model/package";
import EntityParticle from "../../../lib/entity/EntityParticle";
import { EnumState } from "../../../lib/entity/components/State";

export const EnumMessageType = {
    PAINT: "NodeEntities.Paint",
};

export default class RenderNodeEntities extends GridCanvasNode {
    constructor(node, { tw = 128, th = 128, size = [] } = {}) {
        super({
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            node: node,
        });
        
        //  Isometric Transformation
        // this.ctx.translate(this.width / 2, 0);   // This sets "where" the canvas origin is (in this case, the rotation point)
        //  // this.ctx.scale(1, 0.5);  //  Not scaling the entities makes an interesting effect
        // this.ctx.rotate(45 * Math.PI /180);

        this.draw();
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, game } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        this.node.each((entity, i) => {
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);
            const state = entity.getComponent(EnumComponentType.STATE);

            if((comp.x >= x) && (comp.x <= (x + w)) && (comp.y >= y) && (comp.y <= (y + h))) {
                //  STUB
                // if(this.img("entity.beaver") && this.img("entity.rabbit")) {
                //     this.tile(entity === game.player ? this.img("entity.beaver") : this.img("entity.rabbit"), this.tw, comp.facing / 45 * this.tw, 0 * this.th, comp.x * this.tw - (this.tw / 2), comp.y * this.th - (this.th / 2));
                // }
                if(comp.model instanceof Models.Circle) {
                    if(entity instanceof EntityParticle) {
                        if(this.img("entity.particle.poof")) {
                            this.tile(this.img("entity.particle.poof"), this.tw, comp.facing / 45 * this.tw, 0 * this.th, comp.x * this.tw - (this.tw / 2), comp.y * this.th - (this.th / 2));
                        }
                    } else {
                        //TODO Move the state-based graphics to a designated rendering manager
                        if(this.img("entity.beaver") && this.img("entity.rabbit")) {
                            let image;
                            if(entity === game.player) {
                                image = this.img("entity.beaver");

                                if(state.current === EnumState.ATTACKING) {
                                    image = this.img("entity.bull");
                                }
                            } else {
                                image = this.img("entity.rabbit")
                            }
                            
                            this.tile(image, this.tw, comp.facing / 45 * this.tw, 0 * this.th, comp.x * this.tw - (this.tw / 2), comp.y * this.th - (this.th / 2));
                        }
                    }

                    // this.prop({ strokeStyle: color, lineWidth: game && entity === game.player ? 3 : 1 }).circle(comp.x * this.tw, comp.y * this.th, comp.model.radius);
                    // if(this.img("entity.beaver") && this.img("entity.rabbit")) {
                    //     this.tile(entity === game.player ? this.img("entity.beaver") : this.img("entity.rabbit"), this.tw, comp.facing / 45 * this.tw, 0 * this.th, comp.x * this.tw - (this.tw / 2), comp.y * this.th - (this.th / 2));
                    // }
                } else if(comp.model instanceof Models.Arc) {
                    // The 90 degree rotation is to accommodate the DOM x,y coordination system
                    this.prop({ strokeStyle: "#888" }).arc(comp.x * this.tw, comp.y * this.th, comp.model.radius, ...this.degToRad(comp.model.left, comp.model.right));

                    const tps = comp.model.getTriangle(comp.x * this.tw, comp.y * this.th, { rotation: -90 });
                    this.triangle(...tps);
                } else if(comp.model instanceof Models.Triangle) {
                    const tps = comp.model.getTriangle(comp.x * this.tw, comp.y * this.th);
                    this.triangle(...tps);
                }
            }
        });
        this.ctx.restore();

        this.dispatch(EnumMessageType.PAINT);
    }
}