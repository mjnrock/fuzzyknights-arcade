import Common from "./package.js";

const FuzzyKnights = {
	Common: Common
};

//!	-=[Master Coordination Mappings]=-
FuzzyKnights.Common.Message.Message.MessageManager = FuzzyKnights.Common.Message.MessageManager;

//@ MessageManager
FuzzyKnights.Common.Game.GameLoop.AddManager(FuzzyKnights.Common.Message.MessageManager);
//@ EntityManager
FuzzyKnights.Common.Game.GameLoop.AddManager(FuzzyKnights.Common.Entity.EntityManager);


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
let e = new FuzzyKnights.Common.Entity.EntityCat();
console.log(FuzzyKnights.Common.Entity.EntityManager);

FuzzyKnights.Common.Game.GameLoop.Run();


//DEBUG Ensure all stuff has loaded
console.log(FuzzyKnights);

export default FuzzyKnights;