/**
 * @typedef {import(".").NS} ns
 *
 * @export
 * @param {ns} ns
 */
import { TermLogger } from "lib/Logger";
import PrettyTable from "lib/PrettyTable";
import { Scanner } from "lib/Scan";
export async function main(ns) {
    let logger = new TermLogger(ns);
    let names = Scanner.list(ns);
    if (names) {
        let pt = new PrettyTable();
        let headers = ["SERVERNAME", "LEVEL", "HACKED", "CASH%", "SEC+", "RAM"];
        let rows = names.map(s => {
            return {
                hostname: s,
                level: ns.getServerRequiredHackingLevel(s),
                admin: ns.hasRootAccess(s),
                ports: {
                    required: ns.getServerNumPortsRequired(s),
                },
                ram: {
                    max: ns.getServerMaxRam(s),
                },
                money: {
                    available: ns.getServerMoneyAvailable(s),
                    max: ns.getServerMaxMoney(s),
                },
                security: {
                    level: ns.getServerSecurityLevel(s),
                    min: ns.getServerMinSecurityLevel(s)
                }
            };
        }).map(s => [
            s.hostname,
            s.level,
            s.admin ? "\u01a6oot" : s.ports.required,
            ns.nFormat(s.money.available / s.money.max || -1, "0%"),
            ns.nFormat(Math.max(0, s.security.level - s.security.min), "0.0"),
            ns.nFormat(s.ram.max * 1024 * 1024 * 1024, "0 ib"),
        ]);
        pt.create(headers, rows);
        pt.sortTable("LEVEL");
        ns.tprint(pt.print());
    }
    else {
        logger.err(`Error getting server list`);
    }
}
export function autocomplete(data, args) {
    return data.servers;
}
