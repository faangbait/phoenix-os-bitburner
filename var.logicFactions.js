/**
 * @typedef {(*.*).NS} ns
 */

import { desired_augmentations, find_best_aug } from "./lib.augmentations.so";
import { PriorityQueue } from "./lib.structures.so";
import factionFactory from "./lib.factions.so";


export const joinFactions = async (ns, player, faction=null) => {

    let faction_graph = new Map();
    
    faction_graph.set("Sector-12", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]);
    faction_graph.set("Chongqing", ["Sector-12", "Aevum", "Volhaven"]);
    faction_graph.set("New Tokyo", ["Sector-12", "Aevum", "Volhaven"]);
    faction_graph.set("Ishima", ["Sector-12", "Aevum", "Volhaven"]);
    faction_graph.set("Aevum", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]);
    faction_graph.set("Volhaven", ["Chongqing", "New Tokyo", "Ishima", "Sector-12", "Aevum"]);
    faction_graph.set("NiteSec", []);
    faction_graph.set("CyberSec", []);
    faction_graph.set("Tian Di Hui", []);
    faction_graph.set("BitRunners", []);
    faction_graph.set("ECorp", []);
    faction_graph.set("The Black Hand", []);
    faction_graph.set("KuaiGong International", []);
    faction_graph.set("MegaCorp", []);
    faction_graph.set("NWO", []);
    faction_graph.set("Four Sigma", []);
    faction_graph.set("OmniTek Incorporated", []);
    faction_graph.set("Blade Industries", []);
    faction_graph.set("Clarke Incorporated", []);
    faction_graph.set("Bachman & Associates", []);
    faction_graph.set("Slum Snakes", []);
    faction_graph.set("Fulcrum Secret Technologies", []);
    faction_graph.set("Silhouette", []);
    faction_graph.set("Tetrads", []);
    faction_graph.set("The Dark Army", []);
    faction_graph.set("Speakers for the Dead", []);
    faction_graph.set("The Covenant", []);
    faction_graph.set("The Syndicate", []);
    faction_graph.set("Illuminati", []);
    faction_graph.set("Daedalus", []);
    
    if (!faction_graph.has(faction)) {
        for (let [name, blockers] of faction_graph) {
            if (!blockers.length) {
                try {
                    ns.joinFaction(name);
                } catch (e) {}
            } else {
                //logic needed
            }
        }
    } else {
        // faction name was specified
        ns.joinFaction(faction);
    }
    
};

/**
 * 
 * @param {NS} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const selectFocusActivity = async (ns, player) => {
    let pqueue = new PriorityQueue();

    const priority_stat = "hacking_mult";


    if (player.work.isWorking) {
        let current = player.work.current.factionName;
        let faction = factionFactory(current);
        if (faction.unowned_augs.size == 0 || desired_augmentations(player, priority_stat).length == 0) { // neuroflux is always included
            ns.stopAction();
            ns.tprint("Stopping work for ", faction.name, "as we need none of their augments");
        }
    } else {
        for (let faction_name of player.faction.membership) {
            let faction = factionFactory(faction_name);
            if (faction.unowned_augs.size > 0) {
                for (let aug of faction.unowned_augs.keys()) {
                    ns.tprint(faction.name,", ",faction.unowned_augs.size, ", ", desired_augmentations(player, priority_stat));
                    if (desired_augmentations(player, priority_stat).has(aug)) {
                        pqueue.add(faction, faction.unowned_augs.size);
                    }
                }
            }
        }
        ns.tprint("Starting work for ", pqueue.peek());
    }


    let next_faction = pqueue.poll();

    if (next_faction) {
        ns.workForFaction(next_faction.name, "Hacking Contracts", false);
    }
    return player;
};


/**
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const buyBestAug = (ns, player) => {
    for (let faction_name of player.faction.membership) {
        let faction = factionFactory(faction_name);
        let best_aug = find_best_aug(ns, player, faction);
        if (best_aug) {
            ns.tprint("aug buy target ", faction_name, " ", best_aug, " can buy? ", faction.can_purchase_aug(player, best_aug.name));
        }
        
    }
};