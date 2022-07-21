import { TermLogger } from "lib/Logger";
import DaemonDefault from "logic/DaemonDefault";
import DaemonJoinDaedalus from "logic/DaemonJoinDaedalus";
import DaemonPrepareToReset from "logic/DaemonPrepareToReset";
import DaemonRedPill from "logic/DaemonRedPill";
import DaemonVisible from "logic/DaemonVisible";
import { PlayerInfo } from "modules/players/Players";
import { ServerInfo } from "modules/servers/Servers";
import { AugCache } from "modules/augmentations/AugmentationCache";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
import { ServerFuncs } from "modules/servers/ServerFunctions";
import DaemonMinimal from "logic/DaemonMinimal";
import DaemonFresh from "logic/DaemonFresh";
import DaemonMeetDaedalus from "logic/DaemonMeetDaedalus";
export const DaemonStrategy = {
    async init(ns) {
        await ServerFuncs.scp_binaries(ns);
    },
    async loop(ns) {
        const logger = new TermLogger(ns);
        while (true) {
            let servers = ServerInfo.all(ns);
            let player = PlayerInfo.detail(ns);
            ServerFuncs.sudo(ns);
            await GameStrategy.execute_strategy(ns, servers, player);
            await ns.asleep(1000);
        }
    },
};
/**
 * Milestone order is roughly:
 * - Daemon Minimal             -> Develop a solid base from minimal resources
 * - Daemon Fresh               -> Develop a solid base from some resources (post-Reset)
 * - Daemon Default             -> Achieve long-term stability of resources
 * - Daemon PrepareToReset      -> Maximize potential of upcoming reset
 * - Daemon MeetDaedalus        -> We are under the number of required augmentations to join Daedalus
 * - Daemon JoinDaedalus        -> We meet the number of required augmentations to join Daedalus
 * - Daemon RedPill             -> We have Daedalus membership and can rush the Red Pill
 * - Daemon Visible             -> We have taken the red pill and our only remaining goal is to backdoor the world daemon
 */
class GameStrategy {
    static select_algorithm(ns, servers, player) {
        let logger = new TermLogger(ns);
        if (servers.find(s => s.isHome && s.ram.trueMax < 256)) {
            return new DaemonMinimal(ns, servers, player);
        }
        let augments = AugCache.all(ns);
        let augs_owned = Array.from(augments.values()).filter(a => a.owned).length;
        let augs_installed = Array.from(augments.values()).filter(a => a.installed).length;
        if (augs_owned > augs_installed) {
            return new DaemonPrepareToReset(ns, servers, player);
        }
        if (player.ports < 3) {
            return new DaemonFresh(ns, servers, player);
        }
        if (servers.filter(s => s.id === "w0r1d_d43m0n").length > 0) {
            return new DaemonVisible(ns, servers, player);
        }
        if (player.faction.membership.includes("Daedalus")) {
            return new DaemonRedPill(ns, servers, player);
        }
        let daedalus_reqs = BitNodeCache.read(ns, 'current').multipliers.augmentations.daedalus_req;
        if (player.hacking.level > 1000 && augs_installed >= daedalus_reqs) {
            return new DaemonJoinDaedalus(ns, servers, player);
        }
        if (player.hacking.level > 2000 && player.market.api.fourSigma && augs_installed > 10) {
            return new DaemonMeetDaedalus(ns, servers, player);
        }
        return new DaemonDefault(ns, servers, player);
    }
    static async execute_strategy(ns, servers, player) {
        let logger = new TermLogger(ns);
        const gs = this.select_algorithm(ns, servers, player);
        // logger.log(`Executing ${gs.module}`)
        if (await gs.__send_control_sequences(ns, servers, player)) {
            await ns.asleep(2000);
        }
        let results = {
            servers: servers,
            legal_attackers: gs.__get_attackers(ns, servers),
            legal_targets: gs.__get_targets(ns, servers),
            prepared_attackers: [],
            prepared_targets: [],
            bundles: [],
            pids: []
        };
        results.prepared_attackers = gs.__prepare_attackers(ns, results.legal_attackers);
        results.prepared_targets = gs.__prepare_targets(ns, results.legal_targets);
        results.bundles = gs.__package(ns, results.prepared_attackers, results.prepared_targets, player);
        results.pids = gs.__deploy(ns, results.bundles);
        gs.__iterate(ns, results);
    }
}
