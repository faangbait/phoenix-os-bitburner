import { RESERVED_HOME_RAM } from "modules/servers/ServerEnums";
class Server {
    constructor(ns, hostname) {
        let data = ns.getServer(hostname);
        this.id = hostname;
        this.hostname = hostname;
        this.admin = data.hasAdminRights;
        this.ip = data.ip;
        this.level = data.requiredHackingSkill;
        this.purchased = (data.purchasedByPlayer && data.hostname !== "home");
        this.connected = data.isConnectedTo;
        this.backdoored = data.backdoorInstalled;
        this.cores = data.cpuCores;
        let reserved = Math.min(data.maxRam * 0.125, RESERVED_HOME_RAM);
        this.ram = {
            used: data.ramUsed,
            max: data.maxRam - (data.hostname === "home" ? reserved : 0),
            free: Math.max(0, data.maxRam - data.ramUsed - (data.hostname === "home" ? reserved : 0)),
            trueMax: data.maxRam
        };
        this.power = Math.max(0, Math.log2(data.maxRam));
        this.organization = data.organizationName;
        this.isHome = (data.hostname === "home");
        this.ports = {
            required: data.numOpenPortsRequired,
            open: data.openPortCount,
            ftp: data.ftpPortOpen,
            http: data.httpPortOpen,
            smtp: data.smtpPortOpen,
            sql: data.sqlPortOpen,
            ssh: data.sshPortOpen
        };
        this.security = {
            level: data.hackDifficulty,
            min: data.minDifficulty,
        };
        this.money = {
            available: data.moneyAvailable,
            max: data.moneyMax,
            growth: data.serverGrowth
        };
        this.hackTime = Math.ceil(ns.getHackTime(data.hostname));
        this.growTime = Math.ceil(ns.getHackTime(data.hostname) * 3.2);
        this.weakenTime = Math.ceil(ns.getHackTime(data.hostname) * 4);
        this.isTarget = (!data.purchasedByPlayer &&
            data.hostname !== "home" &&
            data.moneyMax > 0 &&
            data.openPortCount >= data.numOpenPortsRequired &&
            data.hasAdminRights &&
            data.requiredHackingSkill <= ns.getHackingLevel());
        this.isAttacker = (data.purchasedByPlayer ||
            data.hostname === "home" ||
            (data.maxRam > 0 && data.hasAdminRights));
        this.pids = Array.from(ns.ps(hostname).map(p => {
            let t = null;
            if (p.args[0] in ServerInfo.names(ns)) {
                t = p.args[0];
            }
            return Object.create({
                filename: p.filename,
                threads: p.threads,
                args: p.args,
                pid: p.pid,
                owner: hostname,
                target: t
            });
        }));
        this.targeted_by = Array.from(ns.ps(hostname).map(p => {
            let t = null;
            if (p.args[0] in ServerInfo.names(ns)) {
                t = p.args[0];
            }
            return Object.create({
                filename: p.filename,
                threads: p.threads,
                args: p.args,
                pid: p.pid,
                owner: hostname,
                target: t
            });
        })).filter(p => p.target && p.target.id == hostname);
    }
}
/**
 * Returns a list of Server objects
 */
export const ServerInfo = {
    all(ns) {
        return ServerInfo.names(ns).map(s => ServerInfo.detail(ns, s));
    },
    detail(ns, hostname) {
        return new Server(ns, hostname);
    },
    names(ns, current = "home", set = new Set(["home"])) {
        let connections = ns.scan(current);
        let next = connections.filter(c => !set.has(c));
        next.forEach(n => {
            set.add(n);
            return ServerInfo.names(ns, n, set);
        });
        return Array.from(set.keys());
    }
};
