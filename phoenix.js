/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

 import * as motd from "./etc.motd";
 import updateData, { firstLoad } from "./lib.loader.so";
 import * as gs from "./lib.gamestates.so";
 import { loop_time } from "./var.constants";
 import { fmt_cash, fmt_num, fmt_bits, hashpower, ram, hashrate, purchased, owned } from "./lib.utils.so";

 const singularity = true; // source file 4, not in default, see "sf4" branch on github.

 export async function main(ns){
     globalThis.ns = ns;
     motd.banner(ns);
     let start_time = new Date();
     let {servers, player} = firstLoad(ns);

     // kill all non-phoenix files on boot
     servers.map(server => server.pids).flat()
        .filter(process => process.filename != "phoenix.js" && process.filename != "sbin.keepalive.js")
        .forEach(process => ns.kill(process.pid));
    
    // start additional scripts
//     if (singularity) {
//         ns.exec("etc.singularity.js", "home");
//     }
    
     while (true) {
         await heartbeat();
         ({servers, player} = updateData(ns, servers, player));
 

        var gameStage = determineGameStage(servers, player);
        var moneyStage = determineResourceAllocation(servers, player);

        //dev
        // var gameStage = gs.gsdebugStage;

         ({player, servers}    = await gameStage.untap       (ns, player, servers));
         ({player, servers}    = await moneyStage.upkeep     (ns, player, servers));
         ({player, servers}    = await gameStage.pre_hack    (ns, player, servers));
         ({player, servers}          = moneyStage.buy_things (ns, player, servers));
         ({player, servers}          = gameStage.hack        (ns, player, servers));
         ({player, servers}    = await gameStage.post_hack   (ns, player, servers));
         ({player, servers}    = await moneyStage.end_step   (ns, player, servers));

         motd.banner_short(ns, start_time);
         display_deltas(ns, player, servers, gameStage, moneyStage);
         display_notices(ns, player, servers, gameStage, moneyStage);
     }

 }

/**
 * "What to buy" logic goes here.
 *
 * @param {ServerObject[]} servers
 * @param {PlayerObject} player
 * @return {gs.DefaultGameStage} 
 */
function determineResourceAllocation(servers, player) {
    var moneyStage = gs.DefaultMoneyStage;

    if (player.ports > 0) {

        const spendCompare = [
            {
                cls: gs.msPurchaseServers,
                compareFns: [
                    (purchased(servers).length < 25), // still haven't bought 25 servers, we're eligible to buy
                    (hashpower(purchased(servers)) < 425) // all servers ~2^17 or higher, we stop sell-buying
                ]
            },
            {
                cls: gs.msHnet,
                compareFns: [
                    (player.hacking.level < (100 * (1 / player.hnet.multipliers.purchaseCost))),
                    (player.playtime.sinceAug < 4*60*1000)
                ]
            },
            {
                cls: gs.msSpendthrift,
                compareFns: [ // if any of these resolve true, we'll stop buying things, but we'll stay in the market if we can.
                    (player.ports === 0 && player.money < 700*1000),
                    (player.ports === 1 && player.money < 1.5*1000*1000),
                    (player.ports === 2 && player.money < 5*1000*1000),
                    (player.hacking.level > 2000 && owned(servers).reduce((a,b) => a+b.ram.max) >= Math.pow(2,20))

                ]
            },
            {
                cls: gs.msStockMarket,
                compareFns: [
                    (player.market.api.fourSigma == true && hashpower(owned(servers)) >= 250), // minimum 20Tb in servers
                    (player.market.api.fourSigma == true && owned(servers).reduce((a,b) => a+b.ram.max) >= 10e15), 
                ]
            },
            {
                cls: gs.msReadyforAug,
                compareFns: [
                    (ns.readPort(1) == "READY FOR AUG"),
                    (player.money > Math.pow(10,12)),
                    (servers.filter(s => s.id === String.fromCharCode(119, 48, 114, 49, 100, 95, 100, 52, 51, 109, 48, 110)).length > 0),
        
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
    }
    return moneyStage;
}

function determineGameStage(servers, player) {
    var gameStage = gs.DefaultGameStage;

    /** @constant
     *
     * ordered by reverse preference. if a later stage applies, it will be selected.
     * e.g. if "early game" is designated by "not in cybersec" but if "end game"
     * is designated by "membership in daedalus", if you're in daedalus but not
     * in cybersec, you'll be placed in the endgame stage, because it's later.
     *
     * When multiple compareFns are specified for a stage, they are OR statements,
     * and if either is true, that stage will resolve as true.
     *
     */
    const stageCompare = [
        {
            cls: gs.gsNewGame,
            compareFns: [
                (servers.filter(s => s.id === "foodnstuff" & !s.admin).length > 0),
                (player.hacking.level < 100),
            ]
        },

        {
            cls: gs.gsEarlyGame,
            compareFns: [
                (player.faction.membership.includes("CyberSec")),
                // (player.ports > 2) // skips the "new game" rote setup if the player has advanced augments
            ]
        },
        {
            cls: gs.gsMidGame,
            compareFns: [
                (player.faction.membership.includes("BitRunners")),
                (servers.map(s => s.ram.max).reduce((a,b) => a+b,0) > 10e7),
            ]
        },
        {
            cls: gs.gsLateGame,
            compareFns: [
                (player.faction.membership.includes("Daedalus")),
            ]
        },
        {
            cls: gs.gsEndGame,
            compareFns: [
                (servers.filter(s => s.id === String.fromCharCode(119, 48, 114, 49, 100, 95, 100, 52, 51, 109, 48, 110)).length > 0),
            ]
        },
        // { // moved to hwgw
        //     cls: gs.gsRepair,
        //     compareFns: [
        //         (servers.filter(s => s.level < 100 && s.money.available / s.money.max < 0.1).length > 7),
        //     ]
        // },
        {
            cls: gs.gsReadyForAug,
            compareFns: [
                (ns.readPort(1) == "READY FOR AUG"),
                (player.money > Math.pow(10,12))
            ]
        }
    ];

    for (const stg of stageCompare) {
        for (const fn of stg.compareFns) {
            if (fn) {
                gameStage = stg.cls;
            }
        }
    }
    return gameStage;
}

 /**
  * Displays info at the bottom of terminal
  *
  * @param {PlayerObject} player
  */
 function display_deltas(ns, player, servers, gameStage, moneyStage) {
     let delta_money = ((player.money - player.last_money) / loop_time)*1000*60;
     let delta_xp = ((player.hacking.exp - player.last_xp) / loop_time)*1000*60;

     ns.tprint(fmt_cash(delta_money), " $/min    ",fmt_num(delta_xp)," xp/min");
     ns.tprint(purchased(servers).length, " racked servers @ ", fmt_bits(ram(purchased(servers))), " total RAM.");
     ns.tprint("Game Stage: ", new gameStage().constructor.name, "    Resource allocation: ", new moneyStage().constructor.name);

     player.last_money = player.money;
     player.last_xp = player.hacking.exp;

 }

 function display_notices(ns, player, servers, gameStage, moneyStage) {
     //check for faction backdoor

    let factions = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
    servers.filter(server => factions.includes(server.hostname) && server.admin && !server.backdoored)
    .forEach(server => ns.tprint("WARNING: You have admin on ", server.hostname, " but have not backdoored it yet."));

 }

async function heartbeat() {
    ns.clearPort(20);
    await ns.writePort(20, new Date().valueOf());
    if (ns.ps("home").filter(process => process.filename == "sbin.keepalive.js").length != 1) {
        ns.exec("sbin.keepalive.js","home");
        ns.print("keepalive not found");
    }

 }

