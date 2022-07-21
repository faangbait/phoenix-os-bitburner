const universal_scanner = (ns, server = "", sf4 = false) => {
    const server_list = new Set(["home"]);
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
    return { route, server_list };
};
export const Scanner = {
    list(ns) {
        let { route, server_list } = universal_scanner(ns);
        return Array.from(server_list.keys());
    },
    route(ns, target = "", sf4 = false) {
        let { route, server_list } = universal_scanner(ns, target, sf4);
        return route;
    },
};
