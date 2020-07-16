import LayeredCanvasNode from "./../hive/LayeredCanvasNode";
import { EnumMessageType } from "./../hive/CanvasNode";
import { EnumComponentType } from "./../entity/components/Component";

import RenderNodeTerrain, { EnumMessageType as EnumNodeTerrainMessageType } from "./graph/Terrain.RenderNode";
import RenderNodeEntities, { EnumMessageType as EnumNodeEntitiesMessageType } from "./graph/Entities.RenderNode";
import GridCanvasNode from "../hive/GridCanvasNode";

import Models from "./../model/package";

export default class Camera extends LayeredCanvasNode {
    constructor(game, node, { x, y, w, h, tw = 32, th = 32, size = [], subject, scale = 1.0 } = {}) {
        super({
            state: {
                game: game,
                viewport: {
                    x,
                    y,
                    width: w,
                    height: h,
                },
                subject,
                scale,
            },
            width: node.tiles.width * (size[ 0 ] || tw),
            height: node.tiles.height * (size[ 1 ] || th),
            size: [ size[ 0 ] || tw, size[ 1 ] || th ],
            stack: [                
                new RenderNodeTerrain(node, { tw, th, size }),
                new RenderNodeEntities(node, { tw, th, size }),
                new GridCanvasNode({
                    width: node.tiles.width * (size[ 0 ] || tw),
                    height: node.tiles.height * (size[ 1 ] || th),
                    size: [ size[ 0 ] || tw, size[ 1 ] || th ],
                })
            ],
        });

        this.mergeState({
            node: node,
        });

        this.getLayer(0).addEffect((state, msg) => {
            if(msg.type === EnumNodeTerrainMessageType.PAINT) {
                this.paint.call(this);
            }
        });
        this.getLayer(1).addEffect((state, msg) => {
            if(msg.type === EnumNodeEntitiesMessageType.PAINT) {
                this.paint.call(this);
            }
        });

        this.addEffect((state, msg) => {
            if(msg.type === EnumMessageType.RENDER) {
                this.draw();
            }
        });

        this.getLayer(2).draw = function({ x = 0, y = 0, w = this.width, h = this.height, scale = 1.0, game } = {}) {            
            if(game && game.setting("isDebugMode")) {
                this.clear();
        
                this.ctx.save();
                this.ctx.scale(scale, scale);

                //STUB
                if(game && game.setting("isDebugMode")) {
                    node.apply((tx, ty, tile) => {
                        if(tx >= x && tx <= x + w && ty >= y && ty <= y + h) {
                            this.prop({
                                strokeStyle: "#0f0",
                            }).gRect(tx, ty, this.tw, this.th);
                        }
                    });
                }
                
                //TODO Move this to a proper location and determine collision from w/e holds that info after the refactor
                node.each((entity, i) => {
                    const comp = entity.getComponent(EnumComponentType.RIGID_BODY);

                    if(comp.model instanceof Models.Arc) {
                        this.prop({
                            strokeStyle: "#0ff",
                        }).circle(comp.x * this.tw, comp.y * this.th, comp.model.radius);
                    }
        
                    if((comp.x >= x) && (comp.x <= (x + w)) && (comp.y >= y) && (comp.y <= (y + h))) {
                        this.prop({
                            strokeStyle: "#0f0",
                        });

                        node.each((e2, i) => {
                            if(entity !== e2) {
                                const c2 = e2.getComponent(EnumComponentType.RIGID_BODY);
    
                                if(comp.model.hasCollision(comp.x, comp.y, c2.model, c2.x, c2.y, { scale: 128 })) {
                                    console.log(true, entity, e2)
                                    this.prop({
                                        strokeStyle: "#f00",
                                    });

                                    return;
                                }
                            }
                        });
                        
                        this.point(comp.x * this.tw, comp.y * this.th);
                        
                        if(comp.model instanceof Models.Circle) {
                            this.circle(comp.x * this.tw, comp.y * this.th, comp.model.radius);
                        } else if(comp.model instanceof Models.Arc) {
                            this.arc(comp.x * this.tw, comp.y * this.th, comp.model.radius, ...this.degToRad(comp.model.start, comp.model.end));

                            const tps = comp.model.getTriangle(comp.x * this.tw, comp.y * this.th);
                            this.triangle(...tps);
                        } else if(comp.model instanceof Models.Triangle) {
                            const tps = comp.model.getTriangle(comp.x * this.tw, comp.y * this.th);
                            this.triangle(...tps);
                        } else if(comp.model instanceof Models.Line) {
                            const lps = comp.model.getLine(comp.x * this.tw, comp.y * this.th);
                            this.line(...lps);
                        }

                        //TODO Abstract this into a "Facing to X,Y" conversion function (e.g. Facing-factored Entity::speed)
                        let x = Math.sin(comp.facing * Math.PI / 180),
                            y = Math.cos(comp.facing * Math.PI / 180);

                        if(x < 0.001 && x > -0.001) {
                            x = 0;
                        } else if(x > 0) {
                            x = 1;
                        } else if(x < 0) {
                            x = -1;
                        } else {
                            x = 0;
                        }

                        if(y < 0.001 && y > -0.001) {
                            y = 0;
                        } else if(y > 0) {
                            y = -1;
                        } else if(y < 0) {
                            y = 1;
                        } else {
                            y = 0;
                        }

                        x *= 0.5;
                        y *= 0.5;

                        this.prop({ strokeStyle: "#00f" }).line(comp.x * this.tw, comp.y * this.th, (comp.x + x) * this.tw, (comp.y + y) * this.th);
                    }
                });
                this.ctx.restore();
        
                this.dispatch(EnumMessageType.PAINT);
            } else {
                this.clear();
            }
        };
    }

    get game() {
        return this.state.game;
    }

    get scale() {
        return this.state.scale;
    }
    set scale(scale) {
        this.state.scale = scale;
    }

    get subject() {
        return this.state.subject;
    }
    set subject(subject) {
        this.state.subject = subject;
    }

    desubject() {
        this.state.subject = null;
    }

    get viewport() {
        const obj = {
            tile: {
                x0: Number.isInteger(this.state.viewport.x) ? this.state.viewport.x : 0,
                y0: Number.isInteger(this.state.viewport.y) ? this.state.viewport.y : 0,
                x1: Number.isInteger(this.state.viewport.x) && Number.isInteger(this.state.viewport.width) ? this.state.viewport.x + this.state.viewport.width : this.node.tiles.width,
                y1: Number.isInteger(this.state.viewport.y) && Number.isInteger(this.state.viewport.height) ? this.state.viewport.y + this.state.viewport.height : this.node.tiles.height,
                width: Number.isInteger(this.state.viewport.width) ? this.state.viewport.width : this.node.tiles.width,
                height: Number.isInteger(this.state.viewport.height) ? this.state.viewport.height : this.node.tiles.height,
            },
            pixel: {
                x0: 0,
                y0: 0,
                x1: null,
                y1: null,
                width: this.width,
                height: this.height,
            }
        };

        obj.pixel.width = obj.tile.width * this.tw;
        obj.pixel.height = obj.tile.height * this.th;
        obj.pixel.x1 = obj.tile.x1 * this.tw;
        obj.pixel.y1 = obj.tile.y1 * this.th;

        return obj;
    }

    get node() {
        return this.state.node;
    }
    set node(value) {
        this.state.node = value;
    }

    draw() {
        //TODO This requires a refactor optimization before this will render smoothly (the Terrain rerendering is currently redraws everything always)
        // for(let layer of this.stack) {
        //     layer.draw({ game: this.game });
        // }
        this.getLayer(1).draw({ game: this.game });
        this.getLayer(2).draw({ game: this.game });

        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.resize(this.viewport.pixel.width * this.scale, this.viewport.pixel.height * this.scale);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.prop({ fillStyle: "#000" }).rect(0, 0, this.width, this.height, { isFilled: true });

        if(this.subject) {
            const comp = this.subject.getComponent(EnumComponentType.RIGID_BODY);
            const vw2 = ~~(this.viewport.pixel.width / 2);
            const vh2 = ~~(this.viewport.pixel.height / 2);

            this.paint(
                (comp.x * this.tw) - vw2,
                (comp.y * this.th) - vh2,
                this.viewport.pixel.width,
                this.viewport.pixel.height,
                0,
                0,
                this.width,
                this.height,
            );
        } else {
            this.paint(
                this.viewport.pixel.x0,
                this.viewport.pixel.y0,
                this.viewport.pixel.width,
                this.viewport.pixel.height,
                0,
                0,
                Math.min(this.viewport.pixel.width, this.width),
                Math.min(this.viewport.pixel.height, this.height),
            );
        }
        this.ctx.restore();
    }
}