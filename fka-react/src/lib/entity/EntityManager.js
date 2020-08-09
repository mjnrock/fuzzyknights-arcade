import Hive from "@lespantsfancy/hive";
import Entity, { EnumEventType as EnumEntityEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";
import EntityAction from "./EntityAction";
import EntityParticle from "./EntityParticle";
import EntityCreature from "./EntityCreature";
import Circle from "../model/Circle";
import { EnumEventType as EnumNodeEventType} from "./../graph/Node";
import { EnumState } from "./components/State";

export default class EntityManager extends Hive.Node {
    constructor(game, node, entities = []) {
        super({
            game: game,
            node: node,
            entities: new Map(entities.map(entity => [ entity.id, entity ])),
        });

        this.game.channel("entity").join((entity, ...args) => {
            if(this.entities.has(entity.id)) {
                this.onEntityEvent.call(this, entity, ...args);
            }
        });
        this.game.channel("node").join((node, type, entity, ...args) => {
            if(this.entities.has(entity.id)) {
                if(type === EnumNodeEventType.ENTITY_JOIN) {
                    this.onEntityJoinNode.call(this, node, entity);
                } else if(type === EnumNodeEventType.ENTITY_LEAVE) {               
                    this.onEntityLeaveNode.call(this, node, entity);
                }
            }
        });
    }

    get game() {
        return this.state.game;
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
        this.remove(entity);

        if(entity instanceof EntityCreature) {
            //? Spawn a death poof
            //TODO Make this an event and spawn the entity as a result of the event
            const rb = entity.getComponent(EnumComponentType.RIGID_BODY);
            if(rb) {
                this.node.addEntity(new EntityParticle({
                    lifespan: 750,
                    data: {
                        [ EnumComponentType.RIGID_BODY ]: {
                            x: rb.x,
                            y: rb.y,
                            speed: 0,
                            model: new Circle(32),
                            facing: rb.facing,
                        }
                    },
                }))
            }
        }

        return this;
    }

    perform(actor, action, ...args) {
        const entity = actor instanceof Entity ? actor : this.entities.get(actor);

        if(entity instanceof Entity) {
            entity.perform(this.game, action, ...args);
        }

        return this;
    }

    tick(dt) {
        if(this.entities.size < 1) {
            return;
        }
        
        let purge = [];
        
        //NOTE If desired, this modification only calls the .tick on entities within a Camera's viewport.  Might be useful here, but the idea should be considered to find its purpose.
        //? Maybe take viewport + some distance?  Maybe Math.min(node w|h, 20)?
        const viewport = this.game.view.camera.viewport;
        const entities = this.node.occupants(viewport.tile.x0, viewport.tile.y0, viewport.tile.x1, viewport.tile.y1);
        
        // this.node.each((entity, i) => {
        entities.forEach((entity, i) => {
            if(!entity.tick(dt, this.game)) {
                purge.push(entity);
            }
        });

        //TODO This collision detection needs refactoring to better deal with all collision scenarios
        // this.node.each((entity, i) => {
        entities.forEach((entity, i) => {
            //* Collision Check
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);

            if(comp) {
                // this.node.each((e2, j) => {
                entities.forEach((e2, j) => {
                    if(entity !== e2) {
                        const c2 = e2.getComponent(EnumComponentType.RIGID_BODY);
    
                        if(c2) {
                            const hasCollision = comp.model.hasCollision(comp.x, comp.y, c2.model, c2.x, c2.y, { scale: 128 });
                            comp.isColliding = comp.isColliding || hasCollision;
                            c2.isColliding = c2.isColliding || hasCollision;
        
                            if(hasCollision) {   //* Rough comparator, will need to be more robust later
                                this.game.send("entity", entity, EnumEntityEventType.COLLISION, e2);
                            }
                        }
                    }
                }, i + 1);
            }

            //* State Updates
            const state = entity.getComponent(EnumComponentType.STATE);

            if(state) {
                state.check();

                // if(entity === this.game.player) {
                //     console.log(state.current)
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
                comp.x += comp.vx * dt;
                comp.y += comp.vy * dt;
            }
        } else if(type === EnumEntityEventType.COLLISION) {
            const [ target ] = args;
            
            if(entity instanceof EntityAction && !(target instanceof EntityAction)) {
                entity.action.execute(entity, target);
            } else if(target instanceof EntityAction && !(entity instanceof EntityAction)) {
                target.action.execute(target, entity);
            }
        } else if(type === EnumEntityEventType.ACTION) {
            const [ action, x, y, facing ] = args;

            this.node.addEntity(new EntityAction({
                action: action,
                data: {
                    [ EnumComponentType.RIGID_BODY ]: {
                        x: x,
                        y: y,
                        speed: 0,
                        model: action.model,
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
}