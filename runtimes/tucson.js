import { BIN_SCRIPTS, CORE_RUNTIMES } from "lib/Variables";
/***************************************************************************************/
/* Tucson - it's basically Phoenix-lite. 8GB friendly.                                 */
/* Recommend that you run this from n00dles so that n00dles                            */
/* can safely exec phoenix on Home when your RAM is ready.                             */
/* scp /sys/tucson.js n00dles; connect n00dles; run NUKE.exe ; run /sys/tucson.js      */
/***************************************************************************************/
const LOOP_TIME = 2000;
export async function main(ns) {
    var target = "foodnstuff";
    let { player, servers } = loadData(ns);
    for (const s of servers) {
        await loadBinaries(ns, s.id);
    }
    while (servers.some(s => s.id === "home" && s.ram.trueMax < 32)) {
        ({ player, servers } = loadData(ns));
        // foodnstuff has just enough cash to get tor, brutessh, and your first RAM upgrade.
        // the very fastest strategy is to run this script, get the ram upgrade, soft reset, then repeat for the port.
        if (player.ports === 0 || target == "joesguns") { // if you're on a different bitnode, this won't work. i've left a more extensible script below.
            for (const s of servers.filter(s => !s.admin)) { // by the end of the second loop, you'll have enough to upgrade ram, script will spawn Phoenix.
                if (player.ports >= s.ports.required) {
                    ns.tprint("Attempting sudo on ", s.id);
                    s.sudo();
                    if (s.threadCount(1.7) >= 1) {
                        ns.exec(BIN_SCRIPTS.BASIC_HACK, s.id, s.threadCount(1.7, true), target);
                    }
                }
            }
            for (const s of servers.filter(s => s.admin)) {
                if (s.threadCount(1.7) >= 1) {
                    ns.exec(BIN_SCRIPTS.BASIC_HACK, s.id, s.threadCount(1.7, true), target);
                }
            }
        }
        else {
            if (servers.filter(s => s.id == "CSEC" && !s.admin)) {
                target = "joesguns";
                // await ns.writePort(1, JSON.stringify({request : "SIGHUP"})); // kills everything
                // await ns.sleep(40000);
                // ns.clearPort(1);
            }
            // balanced approach...for other bitnodes.
            // for (const s of servers.filter(s => !s.admin)) {
            //     if (player.ports >= s.ports.required) {
            //         ns.tprint("Attempting sudo on ", s);
            //         s.sudo();
            //         await loadBinaries(ns, s.id);
            //         if (s.threadCount(1.75) >= 2) {
            //             ns.exec("/bin/wk.js", s.id, 1, "joesguns");
            //             ns.exec("/bin/gr.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         } else if (s.threadCount(1.75) >= 1) {
            //             ns.exec("/bin/gr.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         }
            //     }
            // }
            // for (const s of servers.filter(s => s.admin)) {
            //     if (s.id == "home" && s.threadCount(1.7) >= 1) {
            //         ns.exec("/bin/hk.js", "home", s.threadCount(1.7, true), "joesguns");
            //     } else {
            //         await loadBinaries(ns, s.id);
            //         if (s.threadCount(1.75) >= 2) {
            //             ns.exec("/bin/wk.js", s.id, 1, "joesguns");
            //             ns.exec("/bin/gr.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         } else if (s.threadCount(1.75) >= 1) {
            //             ns.exec("/bin/gr.js", s.id, s.threadCount(1.75, true), "joesguns");
            //         }
            //     }
            // }
        }
        await ns.sleep(LOOP_TIME);
    }
    ns.exec(CORE_RUNTIMES.PHOENIX, "home");
}
const loadData = (ns) => {
    let player = {
        id: "player",
        ports: ns.ls("home", ".exe").filter(f => [
            "BruteSSH.exe",
            "FTPCrack.exe",
            "RelaySMTP.exe",
            "HTTPWorm.exe",
            "SQLInject.exe"
        ].includes(f)).length
    };
    let serverList = ["home", "n00dles", "foodnstuff", "sigma-cosmetics", "max-hardware", "joesguns", "hong-fang-tea", "CSEC", "phantasy", "the-hub", "catalyst", "lexo-corp", "alpha-ent", "global-pharm", "unitalife", "defcomm", "zb-def", "aevum-police", "galactic-cyber", "omnia", "univ-energy", "taiyang-digital", "microdyne", "fulcrumtech", ".", "nwo", "fulcrumassets", "powerhouse-fitness", "megacorp", "stormtech", "omnitek", "run4theh111z", "nova-med", "titan-labs", "helios", "4sigma", "blade", "vitalife", "kuai-gong", "b-and-a", "The-Cave", "clarkinc", "ecorp", "applied-energetics", "solaris", "infocomm", "zeus-med", "computek", "zb-institute", "rho-construction", "I.I.I.I", "johnson-ortho", "rothman-uni", "summit-uni", "crush-fitness", "syscore", "millenium-fitness", "aerocorp", "deltaone", "icarus", "snap-fitness", "avmnite-02h", "harakiri-sushi", "zer0", "neo-net", "silver-helix", "netlink", "iron-gym", "nectar-net", "omega-net"];
    let servers = serverList.map(server => {
        return {
            id: server,
            hostname: server,
            admin: ns.hasRootAccess(server),
            ram: {
                used: ns.getServerUsedRam(server),
                max: ns.getServerMaxRam(server),
                free: Math.max(0, ns.getServerMaxRam(server) - ns.getServerUsedRam(server)),
                trueMax: ns.getServerMaxRam(server)
            },
            isHome: (server === "home"),
            ports: {
                required: (function () {
                    if (["n00dles", "foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"].includes(server)) {
                        return 0;
                    }
                    if (["neo-net", "CSEC", "zer0", "max-hardware", "iron-gym"].includes(server)) {
                        return 1;
                    }
                    if (["phantasy", "silver-helix", "omega-net", "avmnite-02h", "crush-fitness", "johnson-ortho", "the-hub"].includes(server)) {
                        return 2;
                    }
                    return 3;
                })(),
            },
            sudo: function () {
                try {
                    ns.brutessh(this.id);
                    ns.ftpcrack(this.id);
                }
                catch (e) { }
                ns.nuke(this.id);
            },
            threadCount: function (scriptRam, strictMode = false) {
                let threads = Math.floor(this.ram.free / scriptRam);
                if (strictMode && threads <= 0) {
                    throw "no threads available";
                }
                return threads;
            },
        };
    });
    return { player, servers };
};
const loadBinaries = async (ns, server) => {
    let bin = ns.ls("home", "/bin/");
    await ns.scp(bin, "home", server);
    let lib = ns.ls("home", "/lib/");
    await ns.scp(lib, "home", server);
};
