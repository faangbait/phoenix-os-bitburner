
import { getAllServers } from "./lib.serverextras.so";
import serverFactory, { ServerSnapshot } from "./lib.server.so";
import playerFactory, { PlayerSnapshot } from "./lib.player.so";
import { handleDB } from "./lib.database.so";

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
 * @param {import("./phoenix-doc").ServerObject[]} servers
 * @param {import("./phoenix-doc").PlayerObject} player
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
    
    player.rate_of_change.player.push({
            
        hacking: {
            exp: new_player.hacking.exp
        },
        money: new_player.money
        
    });
    

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


// export async function snapshotServer(server) {
//     const db = await handleDB();
//     const snap = new ServerSnapshot(server);
//     await db.put("servers", snap);
// }

// export async function snapshotPlayer(player) {
//     // await handleDB().put("player", new ServerSnapshot(player));
//     const db = await handleDB();
//     const snap = new PlayerSnapshot(player);
//     await db.put("player", snap);
// }

export const snapshotServer = async (server) => {
    const db = await handleDB();
    const snap = new ServerSnapshot(server);
    await db.put("servers", snap);
};

export const snapshotPlayer = async (player) => {
    const db = await handleDB();
    const snap = new PlayerSnapshot(player);
    await db.put("player", snap);
};
