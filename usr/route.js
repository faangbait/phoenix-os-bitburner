import { getAllServers } from "../lib.serverextras.so";

/**
 * displays a copy-and-pasteable route to a server
 * 
 * @argument hostname
 * @export
 * @param {*} ns
 */
export async function main(ns) {
    ns.tprint(getAllServers(ns, ns.args[0]));
}


export function autocomplete(data, args) {
    return data.servers;
}