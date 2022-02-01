/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 * @argument {number} delay
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns){
    if (ns.args[1] > 0) {
        await ns.sleep(ns.args[1]);
    }
    while (true) {
        await control(ns);
        await ns.weaken(ns.args[0]);
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