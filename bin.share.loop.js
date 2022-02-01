/**
 * @typedef {import(".").NS} ns
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    while(true) {
        await control(ns);
        await ns.share();
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