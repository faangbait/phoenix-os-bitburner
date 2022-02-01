/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    let target = ns.args[0];

    if (ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target) < 1) {
        let growThreads = ns.growthAnalyze(target, ns.getServerMaxMoney(target)/ (ns.getServerMoneyAvailable(target)+1));
        try {
            await ns.grow(target, { threads: Math.ceil(growThreads)});
        } catch (e) {
            await ns.grow(target); 
        }
    }

    await control(ns);

    if (ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target) > 0) {
            await ns.weaken(target);
    }

}



async function control(ns) {
    let cc = ns.peek(1);
    if (cc !== "NULL PORT DATA") {
        cc = JSON.parse(cc);
        if (cc.request == "SIGHUP") {
            ns.exit();
        }
    }
}