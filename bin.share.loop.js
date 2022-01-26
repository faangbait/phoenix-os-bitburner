/**
 * @typedef {import(".").NS} ns
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    while(true) {
        await ns.share();
    }
}