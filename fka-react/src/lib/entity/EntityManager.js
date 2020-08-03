import Hive from "@lespantsfancy/hive";
import { EnumEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";
import EntityAction from "./EntityAction";

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

        //* Perform additional work here, if needed

        return this;
    }

    tick(dt) {
        if(this.entities.size < 1) {
            return;
        }
        
        let purge = [];
        
        this.node.each((entity, i) => {
            if(!entity.tick(dt, this.game)) {
                purge.push(entity);
            }
        });

        //TODO This collision detection needs refactoring to better deal with all collision scenarios
        this.node.each((entity, i) => {
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);

            if(comp) {
                this.node.each((e2, j) => {
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