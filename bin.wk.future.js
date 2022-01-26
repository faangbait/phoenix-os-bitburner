/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 * @argument {number} time in millis
 *
 * @export
 * @param {ns} ns
 */

 export async function main(ns){
    let curtime = new Date().valueOf();
    ns.print("Firing payload at ", curtime, " (plus my growtime)");
    await ns.sleep(ns.args[1] - curtime);
    await ns.weaken(ns.args[0]);
}