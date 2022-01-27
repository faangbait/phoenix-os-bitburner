/** @param {NS} ns **/
export async function main(ns) {
	await ns.scp(ns.args.slice(1), "home", ns.args[0]);
}