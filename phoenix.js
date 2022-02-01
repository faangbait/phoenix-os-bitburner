/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import * as motd from "./etc.motd";
import updateData, { firstLoad, snapshotServer, snapshotPlayer } from "./lib.loader.so";

/***************************************************************/
/*                     RAM USAGE CONTROL                       */
/* In this section, we define a bunch of "fake" files.         */
/* Using the "fake" imports allows operation on systems with   */
/* lower specifications, albeit at reduced functionality.      */
/***************************************************************/

/***************************************************************/
/*                  SINGULARITY FUNCTIONS                      */
import * as sing from "./lib.singularity.so";
/*                  SINGULARITY FAKES                          */
// import * as sing from "./fake.singularity.so";
/***************************************************************/

/***************************************************************/
/*                  FACTION FUNCTIONS                          */
import * as facts from "./lib.factions.so";
/*                  FACTION FAKES                              */
// import * as facts from "./fake.factions.so";
/***************************************************************/

/***************************************************************/
/*                  CORPORATION FUNCTIONS                      */
// import * as corps from "./lib.corps.so";
/*                  CORPORATION FAKES                          */
import * as corps from "./fake.corps.so";
/***************************************************************/

/***************************************************************/
/*                  CRIME FUNCTIONS                            */
// import * as crimes from "./lib.crime.so";
/*                  CRIME FAKES                                */
import * as crimes from "./fake.crime.so";
/***************************************************************/

/***************************************************************/
/*                  CODING CONTRACT FUNCTIONS                  */
// import * as challenges from "./lib.coding.so";
/*                  CODING CONTRACT FAKES                      */
import * as challenges from "./fake.coding.so";
/***************************************************************/

/***************************************************************/
/*                  SLEEVE FUNCTIONS                           */
// import * as sleeves from "./lib.sleeve.so";
/*                  SLEEVE FAKES                               */
import * as sleeves from "./fake.sleeve.so";
/***************************************************************/

/***************************************************************/
/*                   <MERGE PLACEHOLDER>                       */
/***************************************************************/

/***************************************************************/
/*                  </MERGE PLACEHOLDER>                       */
/***************************************************************/

/***************************************************************/
/*                  USER OVERLOADS                             */
/* I strongly suggest you move these files to a new location.  */
/* You'll probably want to update this software in the future  */
/* without losing all your customizations.                     */

import { determineResourceAllocation } from "./logic.money";
import { determineHackStrategy } from "./logic.hack";
import { loop_time } from "./var.constants";

// import { determineResourceAllocation } from "./home.logicMoney";
// import { determineGameStage } from "./home.logicHacking";

/***************************************************************/
/* Note: you can overload other parts of this script (except)  */
/* the main loop in a similar manner. Just adjust the imports  */
/* to point to your new location.                              */
/*                                                             */
/* To prevent filename conflicts, this script will never       */
/* prefix a module with "home." or "/home" or any derivative.  */
/***************************************************************/
 
export async function main(ns){
    globalThis.ns = ns;
    motd.banner(ns);
    let start_time = new Date();
    let {servers, player} = firstLoad(ns);

    // kill all non-phoenix files on boot
    servers.map(server => server.pids).flat()
        .filter(process => process.filename != "phoenix.js" && process.filename != "sbin.keepalive.js")
        .forEach(process => ns.kill(process.pid));
    
    while (true) {
        await heartbeat(ns, player, servers);
        
        ({servers, player} = updateData(ns, servers, player));

        // dev note: snapshotting is new functionality. if it throws an error, you can safely comment it out.
        // when this data becomes used for something, i'll remove this note. please file a bug report if you have
        // any issues, as theoretically, database access is browser-dependent.
        let ssp = await snapshotPlayer(player);
        await ns.write("player.text", JSON.stringify(ssp), "a");

        for await (const server of servers) {
            let sss = await snapshotServer(server);
            await ns.write("servers.txt", JSON.stringify(sss), "a");
        }

        // await ns.wget(`http://localhost:8000/report/bn4/player/${new Date().valueOf()}/${JSON.stringify(snapshotPlayer)}/`, "nothing.txt");
        // await ns.wget(`http://localhost:8000/report/bn4/server/${new Date().valueOf()}/${JSON.stringify(snapshotServer)}/`, "nothing.txt");
        
        // var gameStage = await determineGameStage(ns, servers, player);
        // var moneyStage = await determineResourceAllocation(ns, servers, player);
        var hackStrategy = await determineHackStrategy(ns, servers, player);
        var moneyStrategy = await determineResourceAllocation(ns, servers, player);
        
        if (player.hackStrategy || player.moneyStrategy) {
            if (hackStrategy != player.hackStrategy) {
                ({ player, servers} = player.hackStrategy.sighup(ns, player, servers));
                player.hackStrategy = hackStrategy;
            }
            
            if (moneyStrategy != player.moneyStrategy) {
                ({ player, servers } = player.moneyStrategy.sighup(ns, player, servers));
                player.moneyStrategy = moneyStrategy;
            }
        }        

        ({player, servers}     = await facts.init            (ns, player, servers));
        ({player, servers}     = await corps.init            (ns, player, servers));
        ({player, servers}     = await crimes.init           (ns, player, servers));
        ({player, servers}     = await challenges.init       (ns, player, servers));
        ({player, servers}     = await sleeves.init          (ns, player, servers));
        ({player, servers}     = await sing.alpha            (ns, player, servers));
        ({player, servers}     = await moneyStrategy.init     (ns, player, servers));
        ({player, servers}           = moneyStrategy.buy_things (ns, player, servers));
        ({player, servers}     = await moneyStrategy.cleanup   (ns, player, servers));
        ({player, servers}     = await hackStrategy.init        (ns, player, servers));
        ({player, servers}           = hackStrategy.do_hack     (ns, player, servers));
        ({player, servers}     = await hackStrategy.cleanup   (ns, player, servers));
        ({player, servers}     = await sing.omega            (ns, player, servers));
         
        await motd.banner_short(ns, player, servers, hackStrategy, moneyStrategy, start_time);
        await ns.sleep(loop_time);
    }
}

async function heartbeat(ns, player, servers) {
    if (servers.some(s => s.hostname == "home" && s.ram.trueMax >= 32)) {
        ns.clearPort(20);
        await ns.writePort(20, new Date().valueOf());
        if (ns.ps("home").filter(process => process.filename == "sbin.keepalive.js").length != 1) {
            ns.exec("sbin.keepalive.js","home");
            ns.print("keepalive not found, restarting");
        }
    } else {
        ns.print("Not enough RAM to start keepalive daemon on home.");
    }
}