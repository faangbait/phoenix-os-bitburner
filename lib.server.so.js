/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import {
    reservedHomeRam
} from "./var.constants";

/**
 * Creates a server object.
 *
 * @export
 * @param {string} hostname
 * @return {ServerObject} 
 */
export default function serverFactory(hostname) {

    let ServerObject = Object.create({});

    Object.defineProperties(ServerObject, {
        id: {
            get: (function () {
                return globalThis.ns.getServer(hostname).hostname;
            }),
        },
        hostname: {
            get: (function () {
                return globalThis.ns.getServer(hostname).hostname;
            }),
        },
        admin: {
            get: (function () {
                return globalThis.ns.getServer(hostname).hasAdminRights;
            })
        },
        level: {
            get: (function () {
                return globalThis.ns.getServer(hostname).requiredHackingSkill;
            })
        },
        purchased: {
            get: (function () {
                if (hostname === "home") { return false; } else {
                return globalThis.ns.getServer(hostname).purchasedByPlayer;
                }
            })
        },

        connected: {
            get: (function () {
                return globalThis.ns.getServer(hostname).isConnectedTo;
            })
        },
        backdoored: {
            get: (function () {
                return globalThis.ns.getServer(hostname).backdoorInstalled;
            })
        },
        cores: {
            get: (function () {
                return globalThis.ns.getServer(hostname).cpuCores;
            })
        },
        ram: {
            get: (function () {
                let data = globalThis.ns.getServer(hostname);
                return {
                    used: data.ramUsed,
                    max: data.maxRam - (data.hostname === "home" ? reservedHomeRam : 0),
                    free: Math.max(0, data.maxRam - data.ramUsed - (data.hostname === "home" ? reservedHomeRam : 0)),
                    trueMax: data.maxRam,
                };
            })
        },
        power: {
            get: (function () {
                return Math.max(0, Math.log(this.ram.trueMax) / Math.log(2));
            })
        },
        organization: {
            get: (function () {
                return globalThis.ns.getServer(hostname).organization;
            })
        },
        isHome: {
            value: (hostname === "home")
        },
        ports: {
            get: (function () {
                let data = globalThis.ns.getServer(hostname);
                return {
                    required: data.numOpenPortsRequired,
                    open: data.openPortCount,
                    ftp: data.ftpPortOpen,
                    http: data.httpPortOpen,
                    smtp: data.smtpPortOpen,
                    sql: data.sqlPortOpen,
                    ssh: data.sshPortOpen
                };
            })
        },
        security: {
            get: (function () {
                let data = globalThis.ns.getServer(hostname);
                return {
                    level: data.hackDifficulty,
                    min: data.minDifficulty,
                };
            })
        },
        money: {
            get: (function () {
                let data = globalThis.ns.getServer(hostname);
                return {
                    available: data.moneyAvailable,
                    max: data.moneyMax,
                    growth: data.serverGrowth
                };
            })
        },

        pids: {
            get: (function () {
                let ps = globalThis.ns.ps(hostname);
                for (let p of ps) {
                    p.owner = hostname;
                    p.target = p.args[0];
                }
                return ps;
            })
        },
        targeted_by: {
            get: (function (){
                let targeting_pids = [];
                    function scan(ns, parent, server, list) {
                        const children = ns.scan(server);
                        for (let child of children) {
                            if (parent == child) {
                                continue;
                            }
                            list.push(child);
                            
                            scan(ns, server, child, list);
                        }
                    }
                    
                    function list_servers(ns) {
                        const list = [];
                        scan(ns, '', 'home', list);
                        return list;
                    }

                    const servers = list_servers(globalThis.ns);
                    for (let server of servers) {
                        const ps = globalThis.ns.ps(server);
                        for (let process of ps) {
                            if (process.args.length > 0) {
                                if (process.args[0] === hostname) {
                                    targeting_pids.push(process);
                                }
                            }
                        }
                    }

                return targeting_pids;
            })
        },
        hackTime: {
            get: (function (){
                if (this.money.max > 0) {
                const player = globalThis.ns.getPlayer();

                const difficultyMult = this.level * this.security.level;

                const baseDiff = 500;
                const baseSkill = 50;
                const diffFactor = 2.5;
                let skillFactor = diffFactor * difficultyMult + baseDiff;
                // tslint:disable-next-line
                skillFactor /= player.hacking + baseSkill;
              
                const hackTimeMultiplier = 5;
                const hackingTime =
                  (hackTimeMultiplier * skillFactor) /
                  (player.hacking_speed_mult * ( 1 + (Math.pow(player.intelligence, 0.8)) / 600 ));
              
                return hackingTime*1000;
                } else {
                    return Number.POSITIVE_INFINITY;
                }

            })
        },
        hackMaxThreads: {
            get: (function () { // base bitnode
                const player = globalThis.ns.getPlayer();
                const balanceFactor = 240;

                const difficultyMult = (100 - this.security.level) / 100;
                const skillMult = (player.hacking - (this.level - 1)) / player.hacking;
                let percentMoneyHacked = (difficultyMult * skillMult * player.hacking_money_mult) / balanceFactor;


                if (percentMoneyHacked < 0) {
                    percentMoneyHacked = 0;
                }
                if (percentMoneyHacked > 1) {
                    percentMoneyHacked = 1;
                }
              
                return this.money.available / Math.max(Math.floor(this.money.available * percentMoneyHacked),1);
            })
        },
        growMaxThreads: {
            get: (function () { // base bitnode

                let ajdGrowthRate = 1 + (1.03 - 1) / this.security.level;
                if (ajdGrowthRate > 1.0035) {
                  ajdGrowthRate = 1.0035;
                }
              
                const serverGrowthPercentage = this.money.growth / 100;
              
                const coreBonus = 1 + (this.cores - 1) / 16;
                const cycles =
                  Math.log(this.money.max / (this.money.available + 1)) /
                  (Math.log(ajdGrowthRate) *
                    globalThis.ns.getPlayer().hacking_grow_mult *
                    serverGrowthPercentage *
                    coreBonus);
              
                return cycles;
              
            })
        },
        weakMaxThreads: {
            get: (function () {
                return (this.security.level - this.security.min) / 0.05;
            })
        },
        weakenTime: {
            get: (function () {
                return this.hackTime * 4;
            })
        },
        growTime: {
            get: (function () {
                return this.hackTime * 3.2;
            })
        },
    });

    ServerObject.create = function (hostname) {
        return new serverFactory(hostname);
    };

    ServerObject.sudo = function () {
        if (!this.admin) {
            globalThis.ns.exec("sbin.sudo.js", "home", 1, this.id);
        }
    };

    ServerObject.threadCount = function (scriptRam, strictMode = false) {
        let threads = Math.floor(this.ram.free / scriptRam);

        if (strictMode && threads <= 0) {
            throw "no threads available";
        }
        return threads;
    };


    return ServerObject;
}

export class ServerSnapshot {
    constructor(ServerObject) {
        for (let prop of [
            "id",
            "hostname",
            "admin",
            "level",
            "purchased",
            "connected",
            "backdoored",
            "cores",
            "ram",
            "power",
            "organization",
            "ports",
            "security",
            "money",
            "pids",
            "targeted_by",
            "hackTime",
            "weakenTime",
            "growTime",
            "hackMaxThreads",
            "growMaxThreads",
            "weakMaxThreads"
        ]) {
            this[prop] = ServerObject[prop];
        }
    }
}
