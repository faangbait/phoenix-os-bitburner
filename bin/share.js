/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} target does nothing, here for compatibility
 * @argument {boolean} runonce defaults false
 *
 * @export
 * @param {ns} ns
 */
import { check_control_sequence } from "lib/Database";
export const main = async (ns) => {
    let args = ns.args;
    let runonce = args[1];
    if (typeof runonce !== "boolean") {
        runonce = false;
    }
    do {
        await check_control_sequence(ns);
        await ns.share();
    } while (!runonce);
};
