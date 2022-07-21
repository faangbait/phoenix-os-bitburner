/**
 * @typedef {import(".").NS} ns
 *
 * @argument {number} next_bitnode
 *
 * @export
 * @param {ns} ns
 */
import { TermLogger } from "lib/Logger";
import { CORE_RUNTIMES, TEMP_F } from "lib/Variables";
export async function main(ns) {
    let args = ns.args;
    let logger = new TermLogger(ns);
    let next_bitnode = args[0];
    if (typeof next_bitnode !== "number") {
        return;
    }
    await ns.write(TEMP_F.CURRENT_BITNODE, next_bitnode);
    try {
        ns.singularity.destroyW0r1dD43m0n(next_bitnode, CORE_RUNTIMES.LAUNCHER);
    }
    catch {
        logger.err(`Ready to destroy world daemon and restart in bitnode ${next_bitnode}`);
    }
}
