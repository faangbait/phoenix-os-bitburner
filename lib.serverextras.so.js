/**
 * If a server is provided, returns a route to that server.
 * If no server is provided, returns a list of servers.
 *
 * @param {import(".").NS} ns
 * @param {string} [server=undefined]
 * @return {string[]} 
 */
export function getAllServers(ns, server=undefined) {
    const server_list = new Set();
    let route = [];
    const scanNode = (parent, server, target, route) => {
        const children = ns.scan(server);
        for (let child of children) {
            if (!server_list.has(child)) {
                server_list.add(child);
            }

            if (parent === child) {
                continue;
            }

            if (child === target) {
                route.unshift(child);
                route.unshift(server);
                return true;
            }

            if (scanNode(server, child, target, route)) {
                route.unshift(server);
                return true;
            }

        }
        return false;
    };

    scanNode('', 'home', server, route);

    if (server) {
        return "connect " + route.join("; connect ") + "; backdoor";
    } else {
        return Array.from(server_list.keys());
    }
}
