/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import * as motd from "./etc.motd";
import { fmt_cash, fmt_num, fmt_bits, ram, hashrate, purchased } from "./lib.utils.so";
import updateData, { firstLoad, snapshotServer, snapshotPlayer } from "./lib.loader.so";
 
/***************************************************************/
/* I strongly suggest you move these files somewhere else.     */
/* You'll probably want to update this software in the future  */
/* without losing all your customizations.                     */

import { determineResourceAllocation } from "./var.logicMoney";
import { determineGameStage } from "./var.logicHacking";

/***************************************************************/
 
const singularity = false; // source file 4, not in default, see "sf4" branch on github.

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
        if (servers.some(s => s.hostname == "home" && s.ram.trueMax >= 32)) {
           await heartbeat();
        } else {
            ns.print("Not enough RAM to start keepalive daemon on home.");
        }

        ({servers, player} = updateData(ns, servers, player));
        await snapshotPlayer(player);

        for await (const server of servers) {
            await snapshotServer(server);
        }

       var gameStage = determineGameStage(servers, player);
       var moneyStage = determineResourceAllocation(servers, player);


        ({player, servers}    = await gameStage.untap       (ns, player, servers));
        ({player, servers}    = await moneyStage.upkeep     (ns, player, servers));
        ({player, servers}    = await gameStage.pre_hack    (ns, player, servers));
        ({player, servers}          = moneyStage.buy_things (ns, player, servers));
        ({player, servers}          = gameStage.hack        (ns, player, servers));
        ({player, servers}    = await gameStage.post_hack   (ns, player, servers));
        ({player, servers}    = await moneyStage.end_step   (ns, player, servers));

        if (Math.random() < 0.05) {
            motd.banner_short(ns, start_time);
        }

        display_deltas(ns, player, servers, gameStage, moneyStage);
        display_notices(ns, player, servers, gameStage, moneyStage);
    }

}

/**
 * Displays info at the bottom of terminal
 *
 * @param {PlayerObject} player
 */
function display_deltas(ns, player, servers, gameStage, moneyStage) {
    ns.tprint(new Date().toLocaleTimeString(), "  Game Stage: ", new gameStage().constructor.name, "    Resource allocation: ", new moneyStage().constructor.name);
    
    if (Math.random() < 0.1) {
        let delta_money = player.money - player.last_money;
        let delta_xp = player.hacking.exp - player.last_xp;
    
        if (delta_money) {
            ns.tprint(fmt_cash(delta_money), ", ",fmt_num(delta_xp)," xp since last notice.   ", purchased(servers).length, " racked servers @ ", fmt_bits(ram(purchased(servers))), " total RAM.");
        }

        player.last_money = player.money;
        player.last_xp = player.hacking.exp;
    }
}

function display_notices(ns, player, servers, gameStage, moneyStage) {
    //check for faction backdoor

    let factions = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
    servers.filter(server => factions.includes(server.hostname) && server.admin && !server.backdoored && player.level >= server.level)
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

