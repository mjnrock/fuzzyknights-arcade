import GridCanvasNode from "../hive/GridCanvasNode";
import { EnumComponentType } from "../entity/components/Component";
import { EnumState } from "../entity/components/State";
import EntityCreature from "../entity/EntityCreature";
import EntityProjectile from "../entity/EntityProjectile";

export default class EntityLayer extends GridCanvasNode {
    constructor(book, { width, height, tw = 128, th = 128, size = [] } = {}) {
        super({
            width: width,
            height: height,
            size: [ size[ 0 ] || tw, size[ 1 ] || th ]
        });

        this.mergeState({
            book: book,
        });
        
        //  Isometric Transformation
        // this.ctx.translate(this.width / 2, 0);   // This sets "where" the canvas origin is (in this case, the rotation point)
        //  // this.ctx.scale(1, 0.5);  //  Not scaling the entities makes an interesting effect
        // this.ctx.rotate(45 * Math.PI /180);
    }

    get book() {
        return this.state.book;
    }
    set book(value) {
        this.state.book = value;
    }

    draw({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, node, game } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        node.each((entity, i) => {
            const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
            const state = entity.getComponent(EnumComponentType.STATE);

            if((rb.x >= x) && (rb.x <= (x + w)) && (rb.y >= y) && (rb.y <= (y + h))) {
                let score;
                //FIXME [ presently partial STUB ] "raccoon.STATE" needs to be dynamically created
                if(state.currentValue === EnumState.IDLE) {
                    if(entity === game.player) {
                        score = this.book.get(`player.idle`);
                    } else {
                        score = this.book.get(`raccoon.idle`);
                    }
                } else if(state.currentValue === EnumState.MOVING) {
                    if(entity instanceof EntityCreature) {
                        score = this.book.get(`raccoon.running`);
                    } else if(entity instanceof EntityProjectile) {
                        score = this.book.get(`spell.fireball`);
                    }
                } else if(state.currentValue === EnumState.ATTACKING) {
                    score = this.book.get(`raccoon.tailwhip`);
                } else if(state.currentValue === EnumState.DEFENDING) {
                    score = this.book.get(`raccoon.tuck`);
                }

                // if(entity === game.player) {
                //     console.log(state.currentValue);
                // }

                //FIXME 0.5 nudges are to center the tile; but this assumes tile and entity will have 1:1 ratio, which will not always be the case
                if(score) {
                    score.drawTo(this.canvas, {
                        facing: rb.facing,
                        elapsedTime: state.current.elapsed,
                        tx: rb.x - 0.5,
                        ty: rb.y - 0.5,
                    });
                }
            }
        });
        this.ctx.restore();
    }
}