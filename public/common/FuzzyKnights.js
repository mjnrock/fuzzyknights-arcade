import Common from "./package.js";

const FuzzyKnights = {
	Common: Common
};

//!	-=[Master Coordination Mappings]=-
FuzzyKnights.Common.Message.Message.MessageManager = FuzzyKnights.Common.Message.MessageManager;

//DEBUG Ensure all stuff has loaded
console.log(FuzzyKnights);

export default FuzzyKnights;