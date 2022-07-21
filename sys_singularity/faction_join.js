/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} name the faction name
 *
 * @export
 * @param {ns} ns
 */
import { TermLogger } from "lib/Logger";
export async function main(ns) {
    let args = ns.args;
    let logger = new TermLogger(ns);
    let faction_name = args[0];
    if (typeof faction_name !== "string") {
        return;
    }
    try {
        ns.singularity.joinFaction(faction_name);
    }
    catch {
        logger.err(`REQUIRED FACTION JOIN: ${faction_name}`);
    }
}
