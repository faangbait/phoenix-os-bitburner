/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

/****************************************************************************/
/* Tucson - it's basically Phoenix-lite. 8GB friendly.                      */
/* Recommend that you run this from n00dles so that n00dles                 */
/* can safely exec phoenix on Home when your RAM is ready.                  */
/* scp tucson.js n00dles; connect n00dles; run NUKE.exe ; run tucson.js     */
/****************************************************************************/


const loop_time = 2000;
export async function main(ns){

    var target = "foodnstuff";
    await loadBinaries(ns, "n00dles");

    while (true) {
        let { player, servers } = loadData(ns); 
                                                                        // foodnstuff has just enough cash to get tor, brutessh, and your first RAM upgrade.
                                                                        // the very fastest strategy is to run this script, get the ram upgrade, soft reset, then repeat for the port.
        if (player.ports === 0 || target == "joesguns") {               // if you're on a different bitnode, this won't work. i've left a more extensible script below.
            for (const s of servers.filter(s => !s.admin)) {            // by the end of the second loop, you'll have enough to upgrade ram, script will spawn Phoenix.
                if (player.ports >= s.ports.required) {
                    ns.tprint("Attempting sudo on ", s);
                    s.sudo();
                    await loadBinaries(ns, s.id);
                    if (s.threadCount(1.7) >= 1) {
                        ns.exec("bin.hk.loop.js", s.id, s.threadCount(1.7, true), target);
                    }
                }
            }

            for (const s of servers.filter(s => s.admin)) {
                if (s.threadCount(1.7) >= 1) {
                    ns.exec("bin.hk.loop.js", s.id, s.threadCount(1.7, true), target);
                }
            }
        } else {
            if (servers.filter(s => s.id == "CSEC" && !s.admin)) {
                target = "joesguns";
                await ns.writePort(1, JSON.stringify({request : "SIGHUP"})); //kills everything
                await ns.sleep(40000);
                ns.clearPort(1);
            }

        // balanced approach...for other bitnodes.

            // for (const s of servers.filter(s => !s.admin)) {
            //     if (player.ports >= s.ports.required) {
            //         ns.tprint("Attempting sudo on ", s);
            //         s.sudo();
            //         await loadBinaries(ns, s.id);
            //         if (s.threadCount(1.75) >= 2) {
            //             ns.exec("bin.wk.loop.js", s.id, 1, "joesguns");
            //             ns.exec("bin.gr.loop.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         } else if (s.threadCount(1.75) >= 1) {
            //             ns.exec("bin.gr.loop.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         }
            //     }
            // }

            // for (const s of servers.filter(s => s.admin)) {
            //     if (s.id == "home" && s.threadCount(1.7) >= 1) {
            //         ns.exec("bin.hk.loop.js", "home", s.threadCount(1.7, true), "joesguns");
            //     } else {
            //         await loadBinaries(ns, s.id);
            //         if (s.threadCount(1.75) >= 2) {
            //             ns.exec("bin.wk.loop.js", s.id, 1, "joesguns");
            //             ns.exec("bin.gr.loop.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         } else if (s.threadCount(1.75) >= 1) {
            //             ns.exec("bin.gr.loop.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         }
            //     }
            // }
        }

        var gameStage = determineGameStage(servers, player);
        var moneyStage = determineResourceAllocation(servers, player);

        // ({player, servers}     = await gameStage.untap       (ns, player, servers));
        // ({player, servers}     = await moneyStage.upkeep     (ns, player, servers));
        // ({player, servers}     = await gameStage.pre_hack    (ns, player, servers));
        // ({player, servers}           = moneyStage.buy_things (ns, player, servers));
        // ({player, servers}           = gameStage.do_hack     (ns, player, servers));
        // ({player, servers}     = await gameStage.post_hack   (ns, player, servers));
        ({player, servers}     = await moneyStage.end_step   (ns, player, servers));

    }
}

const loadData = (ns) => {
    // let pData = ns.getPlayer();

    let player = {
        id: "player",
        // hp: {
        //     current: pData.hp,
        //     max: pData.max_hp
        // },
        // level: pData.hacking,
        // money: pData.money,
        // intelligence: pData.intelligence,
        // location: pData.location,
        // city: pData.city,
        // hacking: {
        //     exp: pData.hacking_exp,
        //     level: pData.hacking,
        //     multipliers: {
        //         chance: pData.hacking_chance_mult,
        //         exp: pData.hacking_exp_mult,
        //         grow: pData.hacking_grow_mult,
        //         money: pData.hacking_money_mult,
        //         level: pData.hacking_level_mult,
        //         speed: pData.hacking_speed_mult
        //     }
        // },
        // hnet: {
        //     multipliers: {
        //         coreCost: pData.hacknet_node_core_mult,
        //         levelCost: pData.hacknet_node_level_mult,
        //         production: pData.hacknet_node_money_mult,
        //         purchaseCost: pData.hacknet_node_purchase_cost_mult,
        //         ramCost: pData.hacknet_node_ram_cost_mult,
        //     }
        // },
        // market: {
        //     api: {
        //         tix: pData.hasTixApiAccess,
        //         fourSigma: pData.has4SDataTixApi
        //     },
        //     manual: {
        //         wse: pData.hasWseAccount,
        //         fourSigma: pData.has4SData
        //     }
        // },
        // playtime: {
        //     total: pData.totalPlaytime,
        //     sinceAug: pData.playtimeSinceLastAug,
        //     sinceBitnode: pData.playtimeSinceLastBitnode
        // },
        ports: ns.ls("home", ".exe").filter(f => [
            "BruteSSH.exe",
            "FTPCrack.exe",
            "RelaySMTP.exe",
            "HTTPWorm.exe",
            "SQLInject.exe"
        ].includes(f)).length
    };

    let serverList = ["home","n00dles","foodnstuff","sigma-cosmetics","max-hardware","joesguns","hong-fang-tea","CSEC","phantasy","the-hub","catalyst","lexo-corp","alpha-ent","global-pharm","unitalife","defcomm","zb-def","aevum-police","galactic-cyber","omnia","univ-energy","taiyang-digital","microdyne","fulcrumtech",".","nwo","fulcrumassets","powerhouse-fitness","megacorp","stormtech","omnitek","run4theh111z","nova-med","titan-labs","helios","4sigma","blade","vitalife","kuai-gong","b-and-a","The-Cave","clarkinc","ecorp","applied-energetics","solaris","infocomm","zeus-med","comptek","zb-institute","rho-construction","I.I.I.I","johnson-ortho","rothman-uni","summit-uni","crush-fitness","syscore","millenium-fitness","aerocorp","deltaone","icarus","snap-fitness","avmnite-02h","harakiri-sushi","zer0","neo-net","silver-helix","netlink","iron-gym","nectar-net","omega-net"];
    let servers = [];

    for (let server of serverList) {
        // let sData = ns.getServer(server);

        let srv = {
            id: server,
            hostname: server,
            admin: ns.hasRootAccess(server),
            // level: sData.requiredHackingSkill,
            // purchased: (sData.hostname !== "home" && sData.purchasedByPlayer),
            // connected: sData.isConnectedTo,
            // backdoored: sData.backdoorInstalled,
            // cores: sData.cpuCores,
            ram: {
                used: ns.getServerUsedRam(server),
                max: ns.getServerMaxRam(server),
                free: Math.max(0, ns.getServerMaxRam(server) - ns.getServerUsedRam(server)),
                trueMax: ns.getServerMaxRam(server)
            },
            // power: Math.max(0, Math.log2(sData.maxRam)),
            // organization: sData.organization,
            isHome: (server === "home"),
            ports: {
                required: (function () {
                    if (["n00dles","foodnstuff","sigma-cosmetics","joesguns","nectar-net","hong-fang-tea","harakiri-sushi"].includes(server)) {
                        return 0;
                    }
                    if (["neo-net", "CSEC", "zer0", "max-hardware", "iron-gym"].includes(server)){
                        return 1;
                    }
                    if (["phantasy", "silver-helix", "omega-net", "avmnite-02h", "crush-fitness", "johnson-ortho", "the-hub"].includes(server)){
                        return 2;
                    }
                    return 3;
                })(),
                // open: sData.openPortCount,
                // ftp: sData.ftpPortOpen,
                // http: sData.httpPortOpen,
                // smtp: sData.smtpPortOPen,
                // sql: sData.sqlPortOpen,
                // ssh: sData.sshPortOpen
            },
            // security: {
            //     level: sData.hackDifficulty,
            //     min: sData.minDifficulty
            // },
            // money: {
            //     available: sData.moneyAvailable,
            //     max: sData.moneyMax,
            //     growth: sData.serverGrowth
            // },
            // pids: (function () {
            //     let ps = globalThis.ns.ps(hostname);
            //     for (let p of ps) {
            //         p.owner = hostname;
            //         p.target = p.args[0];
            //     }
            //     return ps;
            // }),
            // targeted_by: [],
            // hackTime: (function () {
            //     if (this.money.max > 0) {
            //         const player = globalThis.ns.getPlayer();

            //         const difficultyMult = this.level * this.security.level;

            //         const baseDiff = 500;
            //         const baseSkill = 50;
            //         const diffFactor = 2.5;
            //         let skillFactor = diffFactor * difficultyMult + baseDiff;
            //         // tslint:disable-next-line
            //         skillFactor /= player.hacking + baseSkill;

            //         const hackTimeMultiplier = 5;
            //         const hackingTime =
            //             (hackTimeMultiplier * skillFactor) /
            //             (player.hacking_speed_mult * (1 + (Math.pow(player.intelligence, 0.8)) / 600));

            //         return hackingTime * 1000;
            //     } else {
            //         return Number.POSITIVE_INFINITY;
            //     }

            // }),
            // hackMaxThreads: {
            //     get: (function () { // base bitnode
            //         const player = globalThis.ns.getPlayer();
            //         const balanceFactor = 240;

            //         const difficultyMult = (100 - this.security.level) / 100;
            //         const skillMult = (player.hacking - (this.level - 1)) / player.hacking;
            //         let percentMoneyHacked = (difficultyMult * skillMult * player.hacking_money_mult) / balanceFactor;


            //         if (percentMoneyHacked < 0) {
            //             percentMoneyHacked = 0;
            //         }
            //         if (percentMoneyHacked > 1) {
            //             percentMoneyHacked = 1;
            //         }

            //         return this.money.available / Math.max(Math.floor(this.money.available * percentMoneyHacked), 1);
            //     })
            // },
            // growMaxThreads: {
            //     get: (function () { // base bitnode

            //         let ajdGrowthRate = 1 + (1.03 - 1) / this.security.level;
            //         if (ajdGrowthRate > 1.0035) {
            //             ajdGrowthRate = 1.0035;
            //         }

            //         const serverGrowthPercentage = this.money.growth / 100;

            //         const coreBonus = 1 + (this.cores - 1) / 16;
            //         const cycles =
            //             Math.log(this.money.max / (this.money.available + 1)) /
            //             (Math.log(ajdGrowthRate) *
            //                 globalThis.ns.getPlayer().hacking_grow_mult *
            //                 serverGrowthPercentage *
            //                 coreBonus);

            //         return cycles;

            //     })
            // },
            // weakMaxThreads: {
            //     get: (function () {
            //         return (this.security.level - this.security.min) / 0.05;
            //     })
            // },
            // weakenTime: {
            //     get: (function () {
            //         return this.hackTime * 4;
            //     })
            // },
            // growTime: {
            //     get: (function () {
            //         return this.hackTime * 3.2;
            //     })
            // },
        };


        srv.sudo = function () {
            try {
                ns.brutessh(this.id);
                ns.ftpcrack(this.id);
            } catch (e) {}
            
            ns.nuke(this.id);
        };
        

        srv.threadCount = function (scriptRam, strictMode = false) {
            let threads = Math.floor(this.ram.free / scriptRam);

            if (strictMode && threads <= 0) {
                throw "no threads available";
            }
            return threads;
        };

        servers.push(srv);
    }
    return { player, servers };
};

    
const loadBinaries = async (ns, server) => {
    let files = ns.ls("home", "bin.");
    await ns.scp(files, "home", server);
};

const determineGameStage = (servers, player) => {

};

const determineResourceAllocation = (servers, player) => {
    var moneyStage = DefaultMoneyStage;

    const spendCompare = [
        {
            cls: ReadyForPhoenix,
            compareFns: [
                (servers.some(s => s.id === "home" && s.ram.trueMax >= 32))
            ]
        }

    ];

    for (const stg of spendCompare) {
        for (const fn of stg.compareFns) {
            if (fn) {
                moneyStage = stg.cls;
            }
        }
    }
    return moneyStage;
};

class GameState {
    /**
     * Creates an instance of GameState.
     * @param {ns} ns
     * @param {PlayerObject} player
     * @memberof GameState
     */
}

export class DefaultMoneyStage extends GameState {
    /**
     * Prior to completing a loop; very last actions
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
    static async end_step(ns, player, servers) { // End of actions
        await ns.sleep(loop_time);
        return {player, servers};
    }
}

export class ReadyForPhoenix extends DefaultMoneyStage {
    static async end_step(ns, player, servers) {
        ns.exec("sbin.keepalive.js", "home");
        ns.exit();
    }
}