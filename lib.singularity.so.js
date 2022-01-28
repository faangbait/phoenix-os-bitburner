import { autoSolve } from "./sing.codingcontracts";
import * as factions from "./var.logicFactions";
import { getAllServers } from "./lib.serverextras.so";

/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */


/**
 * 
 * @param {ns} ns 
 * @param {PlayerObject} player 
 * @param {ServerObject[]} servers 
 */
export const alpha = async (ns, player, servers) => {
        //solve coding contracts
		autoSolve(ns, servers.map(s => s.id));

        //join factions without any restrictions
		await factions.joinFactions(ns, player);
		await factions.selectFocusActivity(ns, player);

        /*****************
		Get software
		*****************/
		try {
			ns.purchaseTor();
		} catch (e) {}

		let software_list = [
			"BruteSSH.exe",
			"FTPCrack.exe",
			"relaySMTP.exe",
			"HTTPWorm.exe",
			"SQLInject.exe"
		];

		for (let software of software_list) {
			try {
				ns.purchaseProgram(software);
			} catch (e) {}
		}
		/*****************
		Upgrade home
		*****************/

		try {
			ns.upgradeHomeRam();
		} catch (e) {}

        try {
			for (let s of servers.filter(s => s.admin && !s.backdoored && s.level <= player.level)) {
                getAllServers(ns, s.id, true);
                for (let link of route) {
                    ns.connect(link);
                }
                await ns.installBackdoor();
                ns.connect("home");
            }
		} catch (e) {}

        

        return { player, servers };
};


/**
 * 
 * @param {ns} ns 
 * @param {PlayerObject} player 
 * @param {ServerObject[]} servers 
 */
export const omega = async (ns, player, servers) => {
    return { player, servers };  
};

