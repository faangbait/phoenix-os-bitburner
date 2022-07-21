import { MOTD } from "lib/Motd";
import { CORE_RUNTIMES, TEMP_F } from "lib/Variables";
import { CACHE_SCRIPTS } from "lib/Database";
import { TermLogger } from "lib/Logger";
import { Scanner } from "lib/Scan";
import { partition_array } from "structures/basics/partitions";
async function launch_and_wait(ns, script, threads = 1, args = []) {
    let pid = ns.run(script, threads, ...args);
    await ns.sleep(10);
    while (ns.isRunning(pid)) {
        ns.tprint(`Waiting on ${pid}`);
        await ns.sleep(10);
    }
}
// max 32gb
export async function main(ns) {
    let args = ns.args;
    let logger = new TermLogger(ns);
    let s = partition_array(Scanner.list(ns), function (a) { return a !== "home"; });
    s.truthy.forEach(serv => ns.killall(serv));
    s.falsy.forEach(serv => ns.ps(serv).filter(proc => proc.filename != CORE_RUNTIMES.LAUNCHER).forEach(proc => ns.kill(proc.pid)));
    let current_bitnode = args[0];
    if (typeof current_bitnode !== "number") {
        current_bitnode = JSON.parse(ns.read(TEMP_F.CURRENT_BITNODE));
        if (typeof current_bitnode !== "number") {
            logger.err("Couldn't detect current BitNode; please relaunch with current BitNode as an argument.");
            return;
        }
    }
    await ns.write(TEMP_F.CURRENT_BITNODE, JSON.stringify(current_bitnode), "w");
    for (let i = 1; i <= 20; i++) {
        ns.clearPort(i);
    }
    logger.info(`Detected BitNode ${current_bitnode}`);
    for (const script of [
        CACHE_SCRIPTS.BITNODES,
        CACHE_SCRIPTS.AUGMENTATIONS,
        CACHE_SCRIPTS.FACTIONS,
        CACHE_SCRIPTS.PLAYERS,
        CACHE_SCRIPTS.SERVERS,
        CACHE_SCRIPTS.CORPORATIONS,
        CACHE_SCRIPTS.CRIMES,
        CACHE_SCRIPTS.SLEEVES
    ]) {
        await launch_and_wait(ns, script);
    }
    MOTD.banner(ns);
    if (ns.getServerMaxRam("home") >= 32) {
        ns.spawn(CORE_RUNTIMES.PHOENIX);
    }
    else {
        ns.spawn(CORE_RUNTIMES.TUCSON);
    }
}
