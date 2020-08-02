import Hive from "@lespantsfancy/hive";
import { EnumEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";

export default class EntityManager extends Hive.Node {
    constructor(game, node, entities = []) {
        super({
            game: game,
            node: node,
            entities: new Map(entities.map(entity => [ entity.id, entity ])),
        });

        this.game.channel("entity").join(this.onEntityEvent);   //? @this will be the Entity in all cases
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

    tick(dt) {
        let purge = [];
        
        this.node.each((entity, i) => {
            if(!entity.tick(dt, this.game)) {
                purge.push(entity);
            }
        });

        //TODO This collision detection needs refactoring to better deal with all collision scenarios
        this.node.each((entity, i) => {
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);

            this.node.each((e2, j) => {
                if(entity !== e2) {
                    const c2 = e2.getComponent(EnumComponentType.RIGID_BODY);

                    const hasCollision = comp.model.hasCollision(comp.x, comp.y, c2.model, c2.x, c2.y, { scale: 128 });
                    comp.isColliding = comp.isColliding || hasCollision;
                    c2.isColliding = c2.isColliding || hasCollision;

                    if(hasCollision && !(entity.parent === e2 || e2.parent === entity)) {   //* Rough comparator, will need to be more robust later
                        this.game.send("entity", e2, EnumEventType.COLLISION, entity);
                    }
                }
            }, i + 1);
        });

        purge.forEach(entity => this.node.removeEntity(entity));
    }

    onEntityEvent(type, ...args) {
        const entity = this;

        if(type === EnumEventType.TICK) {
            const [ dt ] = args;
            const comp = entity.getComponent(EnumComponentType.RIGID_BODY);
            
            if(comp) {
                comp.isColliding = false;
                comp.x += comp.vx * dt;
                comp.y += comp.vy * dt;
            }
        } else if(type === EnumEventType.COLLISION) {
            //TODO All collision logic stems from here.  Add a "spawned by" flag in Entity, to act as ability/entity progenitor
            const [ target ] = args;
            
            //  STUB
            const comp = target.getComponent(EnumComponentType.LIFE);

            if(comp) {
                comp.HP.subtract(0.025);
            }
        }
    }
}