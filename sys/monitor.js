import PrettyTable from "lib/PrettyTable";
import { ServerInfo } from "modules/servers/Servers";
export const main = async (ns) => {
    while (true) {
        ns.clearLog();
        ns.tail();
        let servers = ServerInfo.all(ns).filter(s => s.isTarget);
        servers.sort((a, b) => a.level - b.level);
        let pt = new PrettyTable();
        var headers = ["SERVER", "CASH", "SEC", "H_TIME", "HACK", "GROW", "WEAK"];
        var rows = servers.map(s => [
            s.id,
            `${ns.nFormat(s.money.available, "0a")}/${ns.nFormat(s.money.max, "0a")}`,
            `${ns.nFormat(Math.max(0, s.security.level), "0.0")}/${ns.nFormat(Math.max(0, s.security.min), "0.0")}`,
            `${ns.nFormat(s.hackTime / 1000, '0a')}`,
            `${ns.nFormat(Math.ceil(ns.hackAnalyzeThreads(s.id, (s.money.max * .01))), '0a')}`,
            `${ns.nFormat(Math.ceil(ns.growthAnalyze(s.id, s.money.max / Math.max(1, s.money.available))), '0a')}`,
            `${ns.nFormat(Math.ceil((0.002 + s.security.level - s.security.min) / .05), '0a')}`
        ]);
        pt.create(headers, rows);
        ns.print(pt.print());
        await ns.sleep(2);
    }
};
