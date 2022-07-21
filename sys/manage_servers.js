/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} command buy or sell
 * @argument {string} hostname hostname of the server
 * @argument {number} size size in GB
 *
 * @export
 * @param {ns} ns
 */
import { TermLogger } from "lib/Logger";
export async function main(ns) {
    let args = ns.args;
    let logger = new TermLogger(ns);
    let command = args[0];
    let hostname = args[1];
    let size = args[2];
    if (typeof (command) === "string") {
        if (typeof (hostname) === "string") {
            if (command === "buy") {
                if (typeof (size) === "number") {
                    logger.info(`Purchased server ${ns.purchaseServer(hostname, size)} of size ${size}`);
                }
                else {
                    logger.err("Can't buy server - size not found");
                }
            }
            else if (command === "sell") {
                if (ns.deleteServer(hostname)) {
                    logger.info(`Deleted server ${hostname}`);
                }
            }
        }
        else {
            logger.err("Can't buy/sell server - invalid hostname");
        }
    }
}
