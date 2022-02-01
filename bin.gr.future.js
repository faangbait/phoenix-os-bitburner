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
    await control(ns);
    await ns.grow(ns.args[0]);
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