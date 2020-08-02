import Hive from "@lespantsfancy/hive";
import { EnumEventType } from "./Entity";
import { EnumComponentType } from "./components/Component";

export default class EntityManager extends Hive.Node {
    constructor(game, entities = []) {
        super({
            entities: new Map(entities.map(entity => [ entity.id, entity ])),
        });

        this.game = game;
        this.game.channel("entity").join(this.onEntityEvent);   //? @this will be the Entity in all cases
    }

    get entities() {
        return this.state.entities;
    }

    tick(node, dt) {
        let purge = [];

        node.each((entity, i) => {
            if(!entity.tick(dt, this.game)) {
                purge.push(entity);
            }
        });

        purge.forEach(entity => node.removeEntity(entity));
    }

    onEntityEvent(type, ...args) {
        if(type === EnumEventType.TICK) {
            const [ dt ] = args;
            const comp = this.getComponent(EnumComponentType.RIGID_BODY);
            
            comp.isColliding = false;
            comp.x += comp.vx * dt;
            comp.y += comp.vy * dt;
        }
    }
}