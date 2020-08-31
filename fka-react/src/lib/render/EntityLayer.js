import Game from "./../Game";
import GridCanvasNode from "../hive/GridCanvasNode";
import { EnumComponentType } from "../entity/components/Component";
import { EnumState } from "../entity/components/State";
import EntityCreature from "../entity/EntityCreature";
import EntityProjectile from "../entity/EntityProjectile";
import EntityItem from "../entity/EntityItem";
import { Bitwise } from "../hive/Helper";
import { EnumItemType } from "./../item/Item";

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

    draw({ x0 = 0, y0 = 0, x1 = this.width, y1 = this.height, scale = 1.0, node } = {}) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.scale(scale, scale);
        node.each((entity, i) => {
            const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
            const storage = entity.getComponent(EnumComponentType.STORAGE);
            const state = entity.getComponent(EnumComponentType.STATE);

            if((rb.x >= x0) && (rb.x <= x1) && (rb.y >= y0) && (rb.y <= y1)) {
                if(entity instanceof EntityItem) {
                    this.prop({
                        strokeStyle: "#874987",
                        lineWidth: 4,
                        fillStyle: "#c969c8",
                    }).circle(rb.x * this.tw, rb.y * this.th, rb.model.radius, { isFilled: true });
                } else if(entity instanceof EntityProjectile) {
                    this.prop({
                        strokeStyle: "#b50e0e",
                        lineWidth: 4,
                        fillStyle: "#d45d1e",
                    }).circle(rb.x * this.tw, rb.y * this.th, rb.model.radius / 2, { isFilled: true });
                } else {
                    this.prop({
                        strokeStyle: "#000",
                        lineWidth: 1,
                        fillStyle: "#000",
                    }).circle(rb.x * this.tw, rb.y * this.th, rb.model.radius);
                }
            }

            // if((rb.x >= x0) && (rb.x <= x1) && (rb.y >= y0) && (rb.y <= y1)) {
            //     let scomp;
            //     //FIXME [ presently partial STUB ] "ENTITY.STATE" needs to be dynamically created
            //     if(state.currentValue === EnumState.IDLE) {
            //         if(entity === Game.$.player) {
            //             scomp = this.book.get(`player.idle`);
            //         } else if(entity instanceof EntityItem) {
            //             if(Bitwise.has(entity.item.type, EnumItemType.WEAPON)) {
            //                 scomp = this.book.get(`sword.idle`);
            //             } else if(Bitwise.has(entity.item.type, EnumItemType.ARMOR)) {
            //                 scomp = this.book.get(`shield.idle`);
            //             }
            //         } else {
            //             // scomp = this.book.get(`raccoon.idle`);
            //             scomp = this.book.get(`tree`);
            //         }
            //     } else if(state.currentValue === EnumState.MOVING) {
            //         if(entity instanceof EntityCreature) {
            //             scomp = this.book.get(`raccoon.running`);
            //         } else if(entity instanceof EntityProjectile) {
            //             scomp = this.book.get(`spell.fireball`);
            //         }
            //     } else if(state.currentValue === EnumState.ATTACKING) {
            //         if(entity === Game.$.player) {
            //             scomp = this.book.get(`player.attacking`);
            //         } else {
            //             scomp = this.book.get(`raccoon.tailwhip`);
            //         }
            //     } else if(state.currentValue === EnumState.DEFENDING) {
            //         scomp = this.book.get(`raccoon.tuck`);
            //     }

            //     if(scomp) {
            //         let ignore = [];

            //         if(storage) {
            //             for(let key of Object.keys(storage.equipment.key)) {
            //                 if(storage.equipment[ key ].isEmpty) {
            //                     ignore.push(key);
            //                 }
            //             }
            //         }

            //         scomp.drawTo(this.canvas, {
            //             ignore,
            //             facing: rb.facing,
            //             elapsedTime: state.current.elapsed,
            //             tx: rb.x,
            //             ty: rb.y,
            //         });
            //     }
            // }
        });
        this.ctx.restore();
    }
}