import Hive from "@lespantsfancy/hive";
import Game from "./../Game";
import Entity, { EnumEventType as EnumEntityEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";
import EntityAction from "./EntityAction";
import { EnumEventType as EnumNodeEventType} from "./../graph/Node";
import { EnumState } from "./components/State";
import { EnumTerrainType } from "./../graph/Terrain";

export default class EntityManager extends Hive.Node {
    constructor(node, entities = []) {
        super({
            node: node,
            entities: new Map(entities.map(entity => [ entity.id, entity ])),
        });

        Game.$.channel("entity").join((entity, ...args) => {
            if(this.entities.has(entity.id)) {
                this.onEntityEvent.call(this, entity, ...args);
            }
        });
        Game.$.channel("node").join((node, type, entity, ...args) => {
            if(this.node === node) {
                if(type === EnumNodeEventType.ENTITY_JOIN) {
                    this.onEntityJoinNode.call(this, node, entity);
                } else if(type === EnumNodeEventType.ENTITY_LEAVE) {               
                    this.onEntityLeaveNode.call(this, node, entity);
                } else if(type === EnumNodeEventType.ENTITY_PORTAL) {
                    this.onEntityPortal.call(this, node, entity, ...args);
                }
            }
        });
    }

    get node() {
        return this.state.node;
    }
    get entities() {
        return this.state.entities;
    }

    kill(entity) {
        this.remove(entity);

        return this;
    }

    add(entity) {
        this.entities.set(entity.id, entity);

        return this;
    }
    remove(entity) {
        this.entities.delete(entity.id);

        return this;
    }

    purge(entity) {
        entity.hook(EnumEntityEventType.DIE);
        this.remove(entity);

        return this;
    }

    perform(actor, index, ...args) {
        const entity = actor instanceof Entity ? actor : this.entities.get(actor);

        if(entity instanceof Entity) {
            entity.perform(index, ...args);
        }

        return this;
    }

    tick(dt, now) {
        if(this.entities.size < 1) {
            return;
        }
        
        let purge = new Set();
        
        //NOTE If desired, this modification only calls the .tick on entities within a Camera's viewport.  Might be useful here, but the idea should be considered to find its purpose.
        //? Maybe take viewport + some distance?  Maybe Math.min(node w|h, 20)?
        const viewport = Game.$.view.camera.viewport;
        const entities = this.node.occupants(viewport.tile.x0, viewport.tile.y0, viewport.tile.x1, viewport.tile.y1);
        
        // this.node.each((entity, i) => {
        entities.forEach((entity, i) => {
            if(!entity.tick(dt, now, Game.$)) {
                purge.add(entity);
            }
        });

        //TODO This collision detection needs refactoring to better deal with all collision scenarios
        // this.node.each((entity, i) => {
        entities.forEach((entity, i) => {
            //* Collision Check
            const rb = entity.getComponent(EnumComponentType.RIGID_BODY);

            if(rb) {
                // this.node.each((e2, j) => {
                entities.forEach((e2, j) => {
                    if(entity !== e2) {
                        const c2 = e2.getComponent(EnumComponentType.RIGID_BODY);
    
                        if(c2) {
                            const hasCollision = rb.model.hasCollision(rb.x, rb.y, c2.model, c2.x, c2.y, { scale: 128 });
                            rb.isColliding = rb.isColliding || hasCollision;
                            c2.isColliding = c2.isColliding || hasCollision;
        
                            if(hasCollision) {   //* Rough comparator, will need to be more robust later
                                Game.$.send("entity", entity, EnumEntityEventType.COLLISION, e2);
                            }
                        }
                    }
                }, i + 1);

                //FIXME Formalize this into a Node Portals check
                if(entity === Game.$.player) {
                    rb.node.checkPortals(entity, rb.x, rb.y);

                    // const n00 = Game.$.graph.getNode(0, 0);
                    // const n10 = Game.$.graph.getNode(1, 0);

                    // if(~~rb.x === 10 && ~~rb.y === 0) {
                    //     n00.removeEntity(entity);
                    //     n10.addEntity(entity);
                    //     rb.x = 10.5;
                    //     rb.y = 18.5;
                    // } else if(~~rb.x === 10 && ~~rb.y === 19) {
                    //     n10.removeEntity(entity);
                    //     n00.addEntity(entity);
                    //     rb.x = 10.5;
                    //     rb.y = 1.5;
                    // }
                }
            }

            //* State Updates
            const state = entity.getComponent(EnumComponentType.STATE);

            if(state) {
                state.check();

                if(state.currentValue === EnumState.DEAD) {
                    purge.add(entity);
                }

                if(rb) {
                    if(rb.vx === 0 && rb.vy === 0 && state.currentValue === EnumState.MOVING) {
                        state.expire();
                    }

                    //FIXME This works, but prevents any other state from being present if entity has velocity
                    //TODO  Figure out a way to refactor this appropriately
                    if((rb.vx !== 0 || rb.vy !== 0) && state.currentValue !== EnumState.MOVING) {
                        state.expire();
                        state.set(EnumState.MOVING, Infinity);
                        state.current.start();
                    }
                }
                // if(entity === Game.$.player) {
                //     console.log(state.currentValue)
                // }
            }
        });

        purge.forEach(entity => this.purge(entity));
    }

    onEntityEvent(entity, type, ...args) {
        if(type === EnumEntityEventType.TICK) {
            const [ dt ] = args;
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);
            
            if(comp) {
                comp.isColliding = false;
                const dx = comp.vx * dt;
                const dy = comp.vy * dt;

                //TODO Formalize this Node movement/Terrain collision paradigm
                if(this.node.getTerrainType(~~(comp.x + dx), ~~(comp.y + dy)) !== EnumTerrainType.WALL) {
                    comp.x += dx;
                    comp.y += dy;
                }
            }
        } else if(type === EnumEntityEventType.COLLISION) {
            const [ target ] = args;
            
            if(entity instanceof EntityAction) {
                if(!(target instanceof EntityAction)) {
                    entity.action.execute(entity, target);
                }
            }
            
            entity.hook(EnumEntityEventType.COLLISION, target);
            target.hook(EnumEntityEventType.COLLISION, entity);
        } else if(type === EnumEntityEventType.ACTION) {
            const [ action, x, y, facing ] = args;
            const model = typeof action.model === "function" ? action.model(entity) : action.model;

            this.node.addEntity(new EntityAction({
                action: action,
                data: {
                    [ EnumComponentType.RIGID_BODY ]: {
                        x: x,
                        y: y,
                        speed: 0,
                        model: model,
                        facing: facing,
                    }
                },
                parent: entity,
            }));
        }
    }

    onEntityJoinNode(node, entity) {
        const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
                
        if(rb) {
            rb.node = node;
        }
    }
    onEntityLeaveNode(node, entity) {        
        const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
                
        if(rb) {
            if(rb.node.id === node.id) {
                rb.node = null;
            }
        }
    }
    onEntityPortal(node, entity, portal) {
        const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
                
        if(rb) {
            node.removeEntity(entity);
            portal.node.addEntity(entity);

            rb.x = portal.nx;
            rb.y = portal.ny;
        }
    }
}