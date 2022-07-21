import { CONTROL_SEQUENCES } from "lib/Database";
import DaemonDefault from "logic/DaemonDefault";
import { PlayerInfo } from "modules/players/Players";
import { ServerInfo } from "modules/servers/Servers";
/**
 * Will run until we have 3 ports. Assume we already have 256GB home ram.
 */
export default class DaemonFresh extends DaemonDefault {
    constructor(ns, servers, player) {
        super(ns, servers, player);
        this.module = "DAEMON_FRESH";
    }
    active_control_sequence(ns, servers, player) {
        if (["CSEC", "avmnite-02h", "I.I.I.I"].map(s => ServerInfo.detail(ns, s)).filter(s => player.ports < s.ports.required &&
            player.hacking.level >= s.level).length > 0) {
            return CONTROL_SEQUENCES.LIQUIDATE_CAPITAL;
        }
        return null;
    }
    disqualify_target(ns, t) {
        return t.level > 40;
    }
    find_focus_task(ns, attackers, player) {
        let bundles = [];
        if (player.faction.membership.length > 0) {
            bundles.push(...this.__start_faction_work(ns, player.faction.membership[0], "Hacking"));
        }
        return bundles;
    }
    generate_action_bundle(ns, attackers, targets) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        bundles.push(...this.__buy_software(ns, 3));
        if (bundles.length == 0) {
            if (player.money > 3e7) {
                bundles.push(...this.__market(ns));
            }
            bundles.push(...this.__hacknet(ns));
        }
        bundles.push(...this.select_hack_algorithm(ns, attackers, targets, player));
        return bundles;
    }
}
