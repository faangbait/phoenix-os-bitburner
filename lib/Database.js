// Non-Singularity version - use one or the other
export var CACHE_SCRIPTS;
(function (CACHE_SCRIPTS) {
    CACHE_SCRIPTS["BITNODES"] = "/sys/cache_bitnode.js";
    CACHE_SCRIPTS["AUGMENTATIONS"] = "/sys/cache_augmentations.js";
    CACHE_SCRIPTS["FACTIONS"] = "/sys/cache_factions.js";
    CACHE_SCRIPTS["SERVERS"] = "/sys/cache_servers.js";
    CACHE_SCRIPTS["PLAYERS"] = "/sys/cache_players.js";
    CACHE_SCRIPTS["CORPORATIONS"] = "/sys/cache_corporations.js";
    CACHE_SCRIPTS["SLEEVES"] = "/sys/cache_sleeves.js";
    CACHE_SCRIPTS["CRIMES"] = "/sys/cache_crimes.js";
})(CACHE_SCRIPTS || (CACHE_SCRIPTS = {}));
// Singularity version - use one or the other
// export enum CACHE_SCRIPTS {
//     BITNODES = `/sys_singularity/cache_bitnode.js`,
//     AUGMENTATIONS = `/sys_singularity/cache_augmentations.js`,
//     FACTIONS = `/sys_singularity/cache_factions.js`,
//     SERVERS = `/sys_singularity/cache_servers.js`,
//     PLAYERS = `/sys_singularity/cache_players.js`,
//     CORPORATIONS = `/sys_singularity/cache_corporations.js`,
//     SLEEVES = `/sys_singularity/cache_sleeves.js`,
//     CRIMES = `/sys_singularity/cache_crimes.js`,
// }
export var PORTS;
(function (PORTS) {
    PORTS[PORTS["control"] = 1] = "control";
    PORTS[PORTS["augmentations"] = 2] = "augmentations";
    PORTS[PORTS["heartbeat"] = 3] = "heartbeat";
    PORTS[PORTS["swap"] = 4] = "swap";
    PORTS[PORTS["factions"] = 5] = "factions";
    PORTS[PORTS["servers"] = 6] = "servers";
    PORTS[PORTS["bitnodes"] = 7] = "bitnodes";
    PORTS[PORTS["players"] = 8] = "players";
    PORTS[PORTS["corporations"] = 9] = "corporations";
    PORTS[PORTS["sleeves"] = 10] = "sleeves";
    PORTS[PORTS["crimes"] = 11] = "crimes";
    PORTS[PORTS["stocks"] = 12] = "stocks";
})(PORTS || (PORTS = {}));
export var CONTROL_SEQUENCES;
(function (CONTROL_SEQUENCES) {
    CONTROL_SEQUENCES[CONTROL_SEQUENCES["SIGHUP"] = 1] = "SIGHUP";
    CONTROL_SEQUENCES[CONTROL_SEQUENCES["PAUSE"] = 2] = "PAUSE";
    CONTROL_SEQUENCES[CONTROL_SEQUENCES["LIQUIDATE_CAPITAL"] = 3] = "LIQUIDATE_CAPITAL";
})(CONTROL_SEQUENCES || (CONTROL_SEQUENCES = {}));
export const Cache = {
    all(ns, port) {
        let data = ns.peek(port);
        if (data === "NULL PORT DATA") {
            return new Map();
        }
        else {
            let res = JSON.parse(data);
            return new Map(res.map(o => [o.id, o]));
        }
    },
    async update(ns, port, obj) {
        let cached = Cache.all(ns, port);
        cached.set(obj.id, obj);
        ns.clearPort(port);
        await ns.tryWritePort(port, JSON.stringify(Array.from(cached.values())));
        return cached;
    },
    read(ns, port, id) {
        let cached = Cache.all(ns, port);
        return cached.get(id);
    },
    async delete(ns, port, id) {
        let cached = Cache.all(ns, port);
        cached.delete(id);
        ns.clearPort(port);
        await ns.tryWritePort(port, JSON.stringify(Array.from(cached.values())));
        return cached;
    }
};
export const check_control_sequence = async (ns) => {
    switch (ns.peek(PORTS.control)) {
        case "NULL PORT DATA":
            break;
        case CONTROL_SEQUENCES.SIGHUP:
            ns.exit();
            break;
        case CONTROL_SEQUENCES.PAUSE:
            while (ns.peek(PORTS.control) === CONTROL_SEQUENCES.PAUSE) {
                await ns.asleep(10);
            }
            break;
        default:
            break;
    }
};
