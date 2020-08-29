import random from "random";

export const Factors = {
    Environment: [ "Temperature", "Humidity", "Precipitation" ],
    Survival: [ "Satiation", "Safety" ],
    Social: [ "Hostility", "Discrimination" ],
};

export function GenerateState({ ignore = [], only = [] } = {}) {
    const thunk = random.uniform(0, 1);
    const attd = {};

    const loop = (cat, facts) => {
        if(!attd[ cat ]) {
            attd[ cat ] = {};
        }

        for(let factor of facts) {
            attd[ cat ][ factor ] = thunk();
        }
    };

    for(let [ category, factors ] of Object.entries(Factors)) {
        if(only.length) {
            if(only.includes(category)) {
                loop(category, factors);
            }
        } else if(ignore.length) {
            if(!ignore.includes(category)) {
                loop(category, factors);
            }
        } else {
            loop(category, factors);
        }
    }

    return attd;
};

export function GenerateAttitudes({ ignore = [], only = [] } = {}) {
    const thunk = random.normal(0.0, 0.625);    // ~89% chance [ -1, 1 ] before clamp
    const truncNorm = () => Math.max(-1.0, Math.min(1.0, thunk()));
    const attd = {};

    const loop = (cat, facts) => {
        if(!attd[ cat ]) {
            attd[ cat ] = {};
        }

        for(let factor of facts) {
            attd[ cat ][ factor ] = truncNorm();
        }
    };

    for(let [ category, factors ] of Object.entries(Factors)) {
        if(only.length) {
            if(only.includes(category)) {
                loop(category, factors);
            }
        } else if(ignore.length) {
            if(!ignore.includes(category)) {
                loop(category, factors);
            }
        } else {
            loop(category, factors);
        }
    }

    return attd;
};