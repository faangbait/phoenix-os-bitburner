/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} server to delete
 *
 * @export
 * @param {ns} ns
 */

export async function main(ns) {
    ns.killall(ns.args[0]);
    ns.deleteServer(ns.args[0]);
}
