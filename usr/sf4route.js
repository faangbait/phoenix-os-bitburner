/**
 * @typedef {import(".").NS} ns
 */
import { getAllServers } from "./lib.serverextras.so";

/**
 * displays a copy-and-pasteable route to a server
 * 
 * @argument hostname
 * @export
 * @param {import(".").NS} ns
 */
export async function main(ns) {
    let route = getAllServers(ns, ns.args[0], true);
    for (let link of route) {
        ns.connect(link);
    }
}


export function autocomplete(data, args) {
    return data.servers;
}