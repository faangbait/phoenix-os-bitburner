import { ServerInfo } from "modules/servers/Servers";
import { ServerCache } from "modules/servers/ServerCache";
export const main = async (ns) => {
    const servers = ServerInfo.all(ns);
    for (const server of servers) {
        await ServerCache.update(ns, server);
    }
};
