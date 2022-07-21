/**
 * This file uses only Enums and Cache files, which makes it zero-ram.
 * It can use other functions that are already present on the server, like exec, ServerInfo, and PlayerInfo.
 */
import { ServerInfo } from "modules/servers/Servers";
export const ServerFuncs = {
    sudo(ns) {
        ServerInfo.all(ns).forEach(s => {
            if (!s.admin) {
                try {
                    ns.brutessh(s.id);
                    ns.ftpcrack(s.id);
                    ns.relaysmtp(s.id);
                    ns.httpworm(s.id);
                    ns.sqlinject(s.id);
                }
                catch { }
                finally {
                    try {
                        ns.nuke(s.id);
                    }
                    catch { }
                }
            }
        });
    },
    async scp_binaries(ns) {
        for (const server of ServerInfo.all(ns)) {
            await ns.scp(ns.ls("home", "/bin/"), server.id);
            await ns.scp(ns.ls("home", "/lib/"), server.id);
        }
    },
    threadCount(server, scriptRam, strictMode = false) {
        let threads = Math.floor(server.ram.free / scriptRam);
        if (strictMode && threads <= 0) {
            throw "no threads available";
        }
        return threads;
    },
    backdoor_critical_servers(ns) {
    }
};
