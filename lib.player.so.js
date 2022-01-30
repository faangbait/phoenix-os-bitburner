/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 * @export
 * @return {PlayerObject} 
 */
export default function playerFactory() {
    let PlayerObject = Object.create({});
    Object.defineProperties(PlayerObject, {
        id: {
            value: "player"
        },
        hp: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    current: data.hp,
                    max: data.max_hp
                };
            })
        },
        level: {
            get: (function () {
                return globalThis.ns.getPlayer().hacking;
            }),
        },
        money: {
            get: (function () {
                return globalThis.ns.getPlayer().money;
            }),
        },
        intelligence: {
            get: (function () {
                return globalThis.ns.getPlayer().intelligence;
            })
        },
        location: {
            get: (function () {
                return globalThis.ns.getPlayer().location;
            })
        },
        city: {
            get: (function () {
                return globalThis.ns.getPlayer().city;
            })
        },
        className: {
            get: (function () {
                return globalThis.ns.getPlayer().className;
            })
        },
        company: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    companyName: data.companyName,
                    multipliers: {
                        rep: data.company_rep_mult
                    }
                };
            })
        },
        bladeburner: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    multipliers: {
                        analysis: data.bladeburner_analysis_mult,
                        max_stamina: data.bladeburner_max_stamina_mult,
                        stamina_gain: data.bladeburner_stamina_gain_mult,
                        success_chance: data.bladeburner_success_chance_mult,
                    }

                };
            })
        },
        createProg: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    progName: data["createProgramName"],
                    reqLevel: data["createProgramReqLvl"]
                };
            })
        },
        crime: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    type: data.crimeType,
                    multipliers: {
                        money: data.crime_money_mult,
                        success: data.crime_success_mult
                    },
                    kills: data.numPeopleKilled,
                    karma: globalThis.ns.heart.break()
                };
            })
        },
        work: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    isWorking: data.isWorking,
                    type: data.workType,
                    jobs: data.jobs,
                    current: {
                        factionName: data.currentWorkFactionName,
                        factionDesc: data.currentWorkFactionDesc
                    },
                    multipliers: {
                        money: data.work_money_mult
                    },
                    stats: {
                        agi: {
                            gained: data.workAgiExpGained,
                            rate: data.workAgiExpGainRate
                        },
                        str: {
                            gained: data.workStrExpGained,
                            rate: data.workStrExpGainRate
                        },
                        cha: {
                            gained: data.workChaExpGained,
                            rate: data.workChaExpGainRate
                        },
                        dex: {
                            gained: data.workDexExpGained,
                            rate: data.workDexExpGainRate
                        },
                        def: {
                            gained: data.workDefExpGained,
                            rate: data.workDefExpGainRate
                        },
                        hack: {
                            gained: data.workHackExpGained,
                            rate: data.workHackExpGainRate
                        },
                        money: {
                            gained: data.workMoneyExpGained,
                            rate: data.workMoneyExpGainRate,
                            loss: data.workMoneyLossRate
                        },
                        rep: {
                            gained: data.workRepExpGained,
                            rate: data.workRepExpGainRate
                        }
                    }
                };
            })
        },
        charisma: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    level: data.charisma,
                    exp: data.charisma_exp,
                    multipliers: {
                        exp: data.charisma_exp_mult,
                        level: data.charisma_mult,
                    }
                };
            })
        },
        agility: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    level: data.agility,
                    exp: data.agility_exp,
                    multipliers: {
                        exp: data.agility_exp_mult,
                        level: data.agility_mult,
                    }
        
                };
            })
        },
        dexterity: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    level: data.dexterity,
                    exp: data.dexterity_exp,
                    multipliers: {
                        exp: data.dexterity_exp_mult,
                        level: data.dexterity_mult,
                    }
        
                };
            })
        },
        defense: {
            get: (function () {
                var data = globalThis.ns.getPlayer();

                return {
                    level: data.defense,
                    exp: data.defense_exp,
                    multipliers: {
                        exp: data.defense_exp_mult,
                        level: data.defense_mult,
                    }
        
                };
            })
        },
        strength: {
            get: (function () {
                var data = globalThis.ns.getPlayer();

                return {
                    level: data.strength,
                    exp: data.strength_exp,
                    multipliers: {
                        exp: data.strength_exp_mult,
                        level: data.strength_mult,
                    }
        
                };
            })
        },
        faction: {
            get: (function () {
                let data = globalThis.ns.getPlayer();
                return {
                    membership: data.factions,
                    multipliers: {
                        rep: data.faction_rep_mult
                    }
                };
            })

        },
        hacking: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    exp: data.hacking_exp,
                    level: data.hacking,
                    multipliers: {
                        chance: data.hacking_chance_mult,
                        exp: data.hacking_exp_mult,
                        grow: data.hacking_grow_mult,
                        money: data.hacking_money_mult,
                        level: data.hacking_level_mult,
                        speed: data.hacking_speed_mult
                    }
                };
            })
        },
        hnet: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    multipliers: {
                        coreCost: data.hacknet_node_core_mult,
                        levelCost: data.hacknet_node_level_mult,
                        production: data.hacknet_node_money_mult,
                        purchaseCost: data.hacknet_node_purchase_cost_mult,
                        ramCost: data.hacknet_node_ram_cost_mult,
                    }
                };
            })

        },
        market: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    api: {
                        tix: data.hasTixApiAccess,
                        fourSigma: data.has4SDataTixApi
                    },
                    manual: {
                        wse: data.hasWseAccount,
                        fourSigma: data.has4SData
                    }
                };
            })
        },
        playtime: {
            get: (function () {
                var data = globalThis.ns.getPlayer();
                return {
                    total: data.totalPlaytime,
                    sinceAug: data.playtimeSinceLastAug,
                    sinceBitnode: data.playtimeSinceLastBitnode
                };
            })
        },
        ports: {
            get: (function () {
                return globalThis.ns.fileExists("BruteSSH.exe") +
                    globalThis.ns.fileExists("FTPCrack.exe") +
                    globalThis.ns.fileExists("RelaySMTP.exe") +
                    globalThis.ns.fileExists("HTTPWorm.exe") +
                    globalThis.ns.fileExists("SQLInject.exe");

            })

        },
        software: {
            get: (function () {
                return {
                    tor: globalThis.ns.getPlayer().tor,
                    ssh: globalThis.ns.fileExists("BruteSSH.exe"),
                    ftp: globalThis.ns.fileExists("FTPCrack.exe"),
                    smtp: globalThis.ns.fileExists("RelaySMTP.exe"),
                    http: globalThis.ns.fileExists("HTTPWorm.exe"),
                    sql: globalThis.ns.fileExists("SQLInject.exe"),
                    formulas: globalThis.ns.fileExists("Formulas.exe"),
                };

            })
        },
        queued_augmentations: {
            value: []
        },
        rate_of_change: {
            value: {
                player: []
            }
        }
    });
    return PlayerObject;
}


export class PlayerSnapshot {
    constructor(PlayerObject) {
        for (let prop of [
            "id",
            "hp",
            "level",
            "money",
            "intelligence",
            "location",
            "city",
            "className",
            "company",
            "bladeburner",
            "createProg",
            "crime",
            "work",
            "charisma",
            "agility",
            "dexterity",
            "defense",
            "strength",
            "faction",
            "hacking",
            "hnet",
            "market",
            "playtime",
            "ports",
            "software"
        ]) {
            this[prop] = PlayerObject[prop];
        }
    }
}
