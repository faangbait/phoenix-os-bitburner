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
        await ns.hack(ns.args[0]);
    }
}