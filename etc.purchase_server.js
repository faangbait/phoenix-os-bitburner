/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {number} ram to purchase
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    ns.purchaseServer("cluster", ns.args[0]);
}
