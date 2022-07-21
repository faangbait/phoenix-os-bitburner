import DaemonDefault from "logic/DaemonDefault";
import { PlayerInfo } from "modules/players/Players";
/**
 * Will run until we have > 256 GB of Server RAM
 * Goal: Increase home RAM > 256 GB
 */
export default class DaemonMinimal extends DaemonDefault {
    constructor(ns, servers, player) {
        super(ns, servers, player);
        this.module = "DAEMON_MINIMAL";
    }
    active_control_sequence(ns, servers, player) {
        return null;
    }
    disqualify_target(ns, t) {
        return t.level > 5;
    }
    find_focus_task(ns, attackers, player) {
        let bundles = [];
        if (player.faction.membership.length > 0) {
            bundles.push(...this.__start_faction_work(ns, player.faction.membership[0], "Hacking"));
        }
        else {
            bundles.push(...this.__start_company_work(ns, "Joe's Guns", "Employee"));
        }
        return bundles;
    }
    generate_action_bundle(ns, attackers, targets) {
        let player = PlayerInfo.detail(ns);
        let bundles = [];
        bundles.push(...this.__buy_software(ns, 1));
        if (bundles.length == 0) {
            if (player.money > 1e8) {
                bundles.push(...this.__upgrade_home(ns, "ram"));
            }
            if (player.money > 3e7) {
                bundles.push(...this.__market(ns));
            }
            if (player.money > 2e6) {
                bundles.push(...this.__hacknet(ns));
            }
        }
        bundles.push(...this.select_hack_algorithm(ns, attackers, targets, player));
        return bundles;
    }
}
