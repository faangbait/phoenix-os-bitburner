/**
 * @public
 */
export interface ServerObject {
    id: string;
    hostname: string;
    ip: string;
    connected: boolean;
    admin: boolean;
    backdoored: boolean;
    level: number;
    cores: number;
    ram: {
        max: number;
        used: number;
        free: number;
        trueMax: number;
    }
    power: number;
    organization: string;
    purchased: boolean;
    isHome: boolean;
    ports: {
        required: number;
        open: number;
        ftp: boolean;
        http: boolean;
        smtp: boolean;
        sql: boolean;
        ssh: boolean;
    }
    security: {
        level: number;
        min: number;
    }
    money: {
        max: number;
        available: number;
        growth: number;
    },
    pids: ProcessInfo[],
    hackTime: number,
    growTime: number,
    weakenTime: number,
    hackMaxThreads: number,
    growMaxThreads: number,
    weakMaxThreads: number,
    

}

/**
 * @public
 */
export interface PlayerObject {
    hp: {
        current: number;
        max: number;
    };
    money: number;
    intelligence: number;
    location: string;
    software: {
        tor: boolean;
        ssh: boolean;
        ftp: boolean;
        smtp: boolean;
        http: boolean;
        sql: boolean;
        formulas: boolean;
    };
    bladeburner: {
        multipliers: {
            analysis: number;
            max_stamina: number;
            stamina_gain: number;
            success_chance: number;
        };

    };
    city: string;
    className: string;
    company: {
        companyName: string;
        multipliers: {
            rep: number;
        };
    };
    createProgram: {
        progName: string;
        reqLevel: number;
    };

    crime: {
        type: string;
        multipliers: {
            money: number;
            success: number;
        },
        kills: number;
        karma: number;
    },

    faction: {
        membership: string[];
        multipliers: {
            rep: number;
        }
    },

    hacking: {
        exp: number;
        level: number;
        multipliers: {
            chance: number;
            exp: number;
            grow: number;
            money: number;
            level: number;
            speed: number;
        }
    },

    market: {
        api: {
            tix: boolean;
            fourSigma: boolean;
        },
        manual: {
            wse: boolean;
            fourSigma: boolean;
        }
    },

    playtime: {
        total: number;
        sinceAug: number;
        sinceBitnode: number;
    },

    ports: number;
    work: {
        isWorking: boolean;
        type: string;
        jobs: string[];
        current: {
            factionName: string;
            factionDesc: string;
        },
        multipliers: {
            money: number;
        },
    }
    stats: {
        agi: {
            gained: number;
            rate: number;
        },
        str: {
            gained: number;
            rate: number;
        },
        cha: {
            gained: number;
            rate: number;
        },
        dex: {
            gained: number;
            rate: number;
        },
        def: {
            gained: number;
            rate: number;
        },
        hack: {
            gained: number;
            rate: number;
        },
        money: {
            gained: number;
            rate: number;
            loss: number;
        },
        rep: {
            gained: number;
            rate: number;
        }

    },
    hnet: {
        multipliers: {
            coreCost: number;
            levelCost: number;
            production: number;
            purchaseCost: number;
            ramCost: number;
        }
    };
    charisma: {
        level: number;
        exp: number;
        multipliers: {
            exp: number;
            level: number;
        }
    };
    agility: {
        level: number;
        exp: number;
        multipliers: {
            exp: number;
            level: number;
        }
    };
    dexterity: {
        level: number;
        exp: number;
        multipliers: {
            exp: number;
            level: number;
        }
    };
    defense: {
        level: number;
        exp: number;
        multipliers: {
            exp: number;
            level: number;
        }
    };
    strength: {
        level: number;
        exp: number;
        multipliers: {
            exp: number;
            level: number;
        }
    };

};

