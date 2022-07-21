/**
 * @typedef {import(".").NS} ns
 *
 * @argument {string} name company name
 * @argument {boolean} focus defaults true
 *
 * @export
 * @param {ns} ns
 */
import { TermLogger } from "lib/Logger";
export async function main(ns) {
    let logger = new TermLogger(ns);
    let args = ns.args;
    let name = args[0];
    let focus = args[1];
    if (typeof (name) !== "string") {
        name = "";
    }
    if (typeof (focus) !== "boolean") {
        focus = true;
    }
    ns.singularity.workForCompany(name, focus);
}
