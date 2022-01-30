/** @param {import(".").NS } ns */
import { getAllServers } from "./lib.serverextras.so";
import serverFactory from "./lib.server.so";



/**
 * Having problems? If you're sure it's not a logic issue, then
 * try running this. If this fixes it, please submit a bug
 * report.
 *
 * @export
 * @param {*} ns
 */
export async function main(ns) {
    globalThis.ns = ns;
    let list = getAllServers(ns);
    let objs = list.map(s => serverFactory(s));
    let binaries = ns.ls("home", "bin.");
    await ns.write("var.debug.txt", "WARNING debug mode enabled", "w");
    let servers = objs.filter(s => s.admin && s.id != "home");
    for (let server of servers) {
        ns.tprint("Copying binaries to ", server.id);
        await ns.scp(binaries, "home", server.id);
        await ns.sleep(0.5);
    }
    ns.tprint("");
    ns.tprint("");
    ns.tprint("");


    if (ns.args[0]) {
        ns.tprint("Patch complete. Spawning phoenix in 10s.");
        ns.kill("sbin.keepalive.js", "home");
        ns.kill("phoenix.js", "home");
        ns.spawn("phoenix.js", "home");
    } else {
        ns.tprint("Patch complete. You should now refresh-> kill all scripts and restart the software with 'run phoenix.js'.");
        ns.killall();
    }
    ns.tprint("");
    ns.tprint("");
    ns.tprint("");

    if (ns.args[0]) {
        ns.kill("sbin.keepalive.js");
        ns.kill("phoenix.js");
        ns.spawn("phoenix.js");
    } else {
        ns.killall();
    }
}
