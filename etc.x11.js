/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import PrettyTable from "./src.prettytable";
/**
 * Columnizes an array and prints it.
 *
 * @param {string[]} line
 * @param {number} [max_width=80]
 * @param {string} [padString="  "]
 */
function* padStartHelper(line, max_width = 80, padString = "  ") {
    max_width = Math.min(max_width, 160);
    let columnCount = Math.floor(max_width / line.length);
    let padding = Math.ceil(Math.max(columnCount, 1), max_width);

    do {
        let string = "";
        for (const field of line) {
            string += field.toString().padStart(padding, padString);
        }
        line = yield string;
    } while (true);
}



/**
 * Prints a display of all the servers included in the servers array.
 * 
 * @param {ns} ns 
 * @param {ServerObject[]} servers 
 */
export const avahi_browse = (ns, servers) => {
    servers.sort((a, b) => a.level - b.level);
    let pt = new PrettyTable();
    var headers = ["SERVERNAME", "LEVEL", "HACKED", "CASH%", "SEC+", "RAM"];
    var rows = servers.map(s => [
        s.id,
        s.level,
        s.admin ? s.backdoored ? "\u0138it" : "\u01a6oot" : s.ports.required,
        ns.nFormat(s.money.available / s.money.max || "", "0%"),
        ns.nFormat(Math.max(0,s.security.level - s.security.min), "0.0"),
        ns.nFormat(s.ram.max * 1024 * 1024 * 1024 || "", "0 ib"),
    ]);
    pt.create(headers,rows);
    ns.tprint(pt.print());
};