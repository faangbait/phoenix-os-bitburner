
import { getAllServers } from "./lib.serverextras.so";
import serverFactory from "./lib.server.so";
import playerFactory from "./lib.player.so";


/**
 * Loads initial data into the game.
 * Also serves to test the various factories.
 *
 * @export
 * @param {import(".").NS} ns
*/

export function firstLoad(ns) {
    var serverList = getAllServers(ns);
    let servers = serverList.map(s => serverFactory(s));
    let player = playerFactory();

    return {
        servers,
        player,
    };
}


/**
 * Handles merging, deduplication, and creation of objects on every update.
 * 
 * @export 
 * @param {import(".").NS} ns
 * @param {ServerObject[]} servers
 * @param {PlayerObject} player
 * @return 
 * 
 */
 export default function updateData(ns, servers, player) {

    let serverList = getAllServers(ns);
    let new_servers = serverList.map(s => serverFactory(s));
    let new_player = playerFactory();

    let serv_ids = [];
    servers.forEach(s => serv_ids.push(s.id));

    for (const server of new_servers) {
        if (!serv_ids.includes(server.id)) {
            servers.push(server);
        }
    }

    for (let server of servers) {
        if (!server.admin && server.ports.required <= player.ports) {
            ns.tprint("Attempting sudo on ", server.id);
            server.sudo();
        }
    }
    
    Object.assign(player, new_player);

    return {
        servers,
        player,
    };
}


/**
 * Handles merging, deduplication, and creation of objects on every update.
 * 
 * @export 
 * @param {import(".").NS} ns
 * @param {ServerObject[]} servers
 * @param {PlayerObject} player
 * @return 
 * 
 */
 export function updateNoSudo(ns, servers, player) {

    let serverList = getAllServers(ns);
    let new_servers = serverList.map(s => serverFactory(s));
    let new_player = playerFactory();

    let serv_ids = [];
    servers.forEach(s => serv_ids.push(s.id));

    for (const server of new_servers) {
        if (!serv_ids.includes(server.id)) {
            servers.push(server);
        }
    }
    
    Object.assign(player, new_player);

    return {
        servers,
        player,
    };
}