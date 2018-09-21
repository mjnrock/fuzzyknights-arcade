import Common from "./package.js";

const FuzzyKnights = {
	Common: Common
};


//@ MessageManager
FuzzyKnights.Common.Message.MessageManager = new FuzzyKnights.Common.Message.MessageManager(FuzzyKnights);
FuzzyKnights.Common.Game.GameLoop.AddManager(FuzzyKnights.Common.Message.MessageManager);
FuzzyKnights.Common.Message.Message.MessageManager = FuzzyKnights.Common.Message.MessageManager;
//@ EntityManager
FuzzyKnights.Common.Entity.EntityManager = new FuzzyKnights.Common.Entity.EntityManager(FuzzyKnights);
FuzzyKnights.Common.Game.GameLoop.AddManager(FuzzyKnights.Common.Entity.EntityManager);
//@ PacketManager
FuzzyKnights.Common.Message.Packet.PacketManager = new FuzzyKnights.Common.Message.Packet.PacketManager(FuzzyKnights);
FuzzyKnights.Common.Game.GameLoop.AddManager(FuzzyKnights.Common.Message.Packet.PacketManager);


//@ EntityHandler
FuzzyKnights.Common.Event.EntityHandler = new FuzzyKnights.Common.Event.EntityHandler(FuzzyKnights.Common.Message.MessageManager);


function AddInitializationHook(target, hook){
    return class extends target {
        constructor(...args) {
            super(...args);
            hook(this);
        }
    };
}

//@ Constructor Hook on Entity for EntityHandler.OnEntityConstruction(manager, entity)
FuzzyKnights.Common.Entity.Entity.prototype.PostInit = (entity) => FuzzyKnights.Common.Event.EntityHandler.OnEntityConstruction(FuzzyKnights.Common.Entity.EntityManager, entity);

//? Testing
// let e = new FuzzyKnights.Common.Entity.EntityCat();
// console.log(FuzzyKnights.Common.Entity.EntityManager);


//DEBUG Ensure all stuff has loaded
// console.log(FuzzyKnights);

export default FuzzyKnights;