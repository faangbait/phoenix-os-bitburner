/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		try {
			ns.upgradeHomeRam();
		} catch (e) {}
		await ns.sleep(60000);
	}
}