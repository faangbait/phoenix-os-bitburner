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
	let start_time = performance.now();
	//solve coding contracts
	autoSolve(ns, servers.map(s => s.id)); // note, this + the import is 20gb of ram alone.

	//join factions without any restrictions
	await factions.joinFactions(ns, player);

	// set best activity
	await factions.selectFocusActivity(ns, player);

	// buy an aug, if appropriate
	player = factions.buyBestAug(ns, player);

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


	let end_time = performance.now();
	ns.tprint("Singularity performance timing ", end_time-start_time);

	/*****************
	Upgrade home
	*****************/

	try {
		ns.upgradeHomeRam();
	} catch (e) {}

	try {
		let factions = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];       
		for (let s of servers.filter(s => factions.includes(s.hostname) && s.admin && !s.backdoored && s.level <= player.level)) {
			let route = getAllServers(ns, s.id, true);
			let first_stop = route.shift(); //pop home off
			if (first_stop != "home") {
				route.unshift(first_stop);
			}

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

