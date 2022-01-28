/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

 import * as motd from "./etc.motd";
 import updateData, { firstLoad } from "./lib.loader.so";
 import { loop_time } from "./var.constants";
 import { fmt_cash, fmt_num, fmt_bits, ram, hashrate, purchased } from "./lib.utils.so";
 
 /***************************************************************/
 /* I strongly suggest you move these files somewhere else.     */
 /* You'll probably want to update this software in the future  */
 /* without losing all your customizations.                     */

 import { determineResourceAllocation } from "./var.logicMoney";
 import { determineGameStage } from "./var.logicHacking";


 /***************************************************************/
 
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

