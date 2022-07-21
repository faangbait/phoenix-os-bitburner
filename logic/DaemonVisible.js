import { SINGULARITY_SCRIPTS } from "lib/Variables";
import DaemonDefault from "logic/DaemonDefault";
import { AugmentationFuncs } from "modules/augmentations/AugmentationFunctions";
import { FactionCache } from "modules/factions/FactionCache";
import { PlayerInfo } from "modules/players/Players";
import { ServerFuncs } from "modules/servers/ServerFunctions";
import { ServerInfo } from "modules/servers/Servers";
import { Sing } from "modules/Singularity";
/**
 * Runs when world daemon is visible.
 * Goal: Win game
 */
export default class DaemonVisible extends DaemonDefault {
    constructor(ns, servers, player) {
        super(ns, servers, player);
        this.daemon = ServerInfo.detail(ns, "w0r1d_d43m0n");
        this.daemon_difficulty = 3000 * this.bn.multipliers.hacking.daemon;
        this.module = "DAEMON_VISIBLE";
        this.next_bitnode = 1;
    }
    active_control_sequence(ns, servers, player) {
        return null;
    }
    select_hack_algorithm(ns, attackers, targets, player) {
        let bundles = [];
        if (player.money > 1e8) {
            return this.__hack_max_xp(ns, attackers, targets, player);
        }
        else {
            bundles.push(...this.__market(ns));
            bundles.push(...this.__hack_default(ns, attackers, targets, player));
        }
        return bundles;
    }
    find_focus_task(ns, attackers, player) {
        let bundles = [];
        let desired_augs = AugmentationFuncs.get_augmentation_path(ns);
        let still_desired = Array.from(desired_augs.values()).filter(a => !a.owned);
        if (still_desired.length > 0) {
            let aug_at_faction = still_desired.find(aug => aug.factions.find(f => FactionCache.read(ns, f).member));
            if (aug_at_faction) {
                let faction = aug_at_faction.factions.find(f => player.faction.membership.includes(f));
                if (faction) {
                    return this.__start_faction_work(ns, faction, "Hacking");
                }
            }
        }
        // TODO: We may need to join a company and work our way up to their faction
        return bundles;
    }
    generate_action_bundle(ns, attackers, targets) {
        let bundles = [];
        let player = PlayerInfo.detail(ns);
        bundles.push(...this.__buy_software(ns));
        if (Sing.has_access(ns)) {
            if (this.daemon.level <= player.hacking.level) {
                if (!this.daemon.admin) {
                    if (this.daemon.ports.required <= player.ports) {
                        ServerFuncs.sudo(ns);
                    }
                }
                if (this.daemon.admin) {
                    bundles.push({
                        file: SINGULARITY_SCRIPTS.DESTROY_DAEMON,
                        attacker: "home",
                        threads: 1,
                        args: [this.next_bitnode],
                        priority: -99
                    });
                }
            }
        }
        if (bundles.length > 0) {
            return bundles;
        }
        return this.select_hack_algorithm(ns, attackers, targets, player);
    }
}
