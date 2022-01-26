/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 * @argument {number} delay
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    if (ns.args[1] > 0) {
        await ns.sleep(ns.args[1]);
    }
    const hostname = ns.args[0];
    while (true) {
        if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname)) {
            await ns.weaken(hostname);
        } else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname)) {
            await ns.grow(hostname);
        } else {
            await ns.hack(hostname);
        }
    }
}