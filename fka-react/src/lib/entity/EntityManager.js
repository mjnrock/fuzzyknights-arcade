import Hive from "@lespantsfancy/hive";
import Entity, { EnumEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";
import EntityAction from "./EntityAction";
import EntityParticle from "./EntityParticle";
import EntityCreature from "./EntityCreature";
import Circle from "../model/Circle";

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
        this.node.removeEntity(entity);

        return this;
    }

    purge(entity) {
        this.node.removeEntity(entity);

        if(entity instanceof EntityCreature) {
            //? Spawn a death poof
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
                                this.game.send("entity", entity, EnumEventType.COLLISION, e2);
                            }
                        }
                    }
                }, i + 1);
            }
        });

        purge.forEach(entity => this.purge(entity));
    }

    onEntityEvent(entity, type, ...args) {
        if(type === EnumEventType.TICK) {
            const [ dt ] = args;
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);
            
            if(comp) {
                comp.isColliding = false;
                comp.x += comp.vx * dt;
                comp.y += comp.vy * dt;
            }
        } else if(type === EnumEventType.COLLISION) {
            const [ target ] = args;
            
            if(entity instanceof EntityAction && !(target instanceof EntityAction)) {
                entity.action.execute(target);
            } else if(target instanceof EntityAction && !(entity instanceof EntityAction)) {
                target.action.execute(entity);
            }
        } else if(type === EnumEventType.ACTION) {
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
}