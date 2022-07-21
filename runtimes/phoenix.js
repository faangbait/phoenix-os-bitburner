import { TermLogger } from "lib/Logger";
import { ServerInfo } from "modules/servers/Servers";
import { CORE_RUNTIMES, SYS_SCRIPTS, } from "lib/Variables";
import { CACHE_SCRIPTS } from "lib/Database";
import { ReservedRam } from "lib/Swap";
import { DaemonStrategy } from "modules/Daemon";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
export const main = async (ns) => {
    ns.disableLog("ALL");
    ns.tail();
    const logger = new TermLogger(ns);
    let start_time = performance.now();
    await init(ns);
    await DaemonStrategy.init(ns);
    logger.log(`Initialization completed in ${ns.nFormat(performance.now() - start_time, '0.0a')} milliseconds`);
    update_players(ns).catch(console.error);
    update_servers(ns).catch(console.error);
    update_augmentations(ns).catch(console.error);
    update_factions(ns).catch(console.error);
    update_corporations(ns).catch(console.error);
    update_crimes(ns).catch(console.error);
    update_sleeves(ns).catch(console.error);
    update_leetcode(ns).catch(console.error);
    DaemonStrategy.loop(ns).catch(console.error);
    while (true) {
        // await heartbeat(ns);
        await ns.asleep(1000);
    }
};
const init = async (ns) => {
    ns.print("BitNode: ", BitNodeCache.read(ns, "current").number);
    let servers = ServerInfo.all(ns);
    servers.filter(s => s.id !== "home")
        .forEach(s => s.pids.forEach(p => ns.kill(p.pid)));
    servers.filter(s => s.id === "home").forEach(s => s.pids.filter(p => p.filename !== CORE_RUNTIMES.KEEPALIVE && p.filename !== CORE_RUNTIMES.PHOENIX)
        .forEach(p => ns.kill(p.pid)));
    ReservedRam.launch_max_reserve_shares(ns);
};
const launch_and_wait = async (ns, script, threads = 1, args = []) => {
    let pid = ns.exec(script, 'home', threads, ...args);
    await ns.asleep(100);
    while (ns.isRunning(pid)) {
        await ns.asleep(10);
    }
};
const update_players = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.PLAYERS);
    await ns.asleep(1000);
} };
const update_servers = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.SERVERS);
    await ns.asleep(500);
} };
const update_augmentations = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.AUGMENTATIONS);
    await ns.asleep(80000);
} };
const update_factions = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.FACTIONS);
    await ns.asleep(30000);
} };
const update_corporations = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.CORPORATIONS);
    await ns.asleep(20000);
} };
const update_crimes = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.CRIMES);
    await ns.asleep(2000);
} };
const update_sleeves = async (ns) => { while (true) {
    await launch_and_wait(ns, CACHE_SCRIPTS.SLEEVES);
    await ns.asleep(2000);
} };
const update_leetcode = async (ns) => { while (true) {
    ns.exec(SYS_SCRIPTS.LEETCODE, "home");
    await ns.asleep(80000);
} };
