/**
 * @typedef {(*.*).NS} ns
 */

import { desired_augmentations, prioritize_augmentations } from "./lib.augmentations.so";
import factionFactory from "./lib.factions.so";
import { faction_blockers } from "./var.constants";

export const joinFactions = async (ns, player, faction=null) => {
    if (faction) {
        ns.joinFaction(faction); // faction name was specified
        return;
    }
    for (let [faction_name, blockers] of faction_blockers) {
        if (!blockers.length) {
            try {
                ns.joinFaction(faction_name);
            } catch(e) {}
        } else {
            let desired = desired_augmentations();
            if (desired.some(aug => aug.factions_offering.includes(faction_name))) { 
                // this faction offers an aug we desire
                try {
                    ns.joinFaction(faction_name);
                } catch(e) {}
            }
        }
    }
};

/**
 * 
 * @param {NS} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const selectFocusActivity = async (ns, player) => {
    let start_time = performance.now();
    const pq = prioritize_augmentations(ns, player);

    if (player.work.isWorking) {
        let current = player.work.current.factionName;
        let faction = factionFactory(current);
        faction.wanted_augs = desired_augmentations().filter(aug => aug.factions_offering.includes(faction.name));

        if (faction.wanted_augs.length == 0) {
            ns.stopAction();
            ns.tprint("Stopping work for ", faction.name, " as we need none of their augments");
            selectFocusActivity(ns, player);
        }
    } else {
        let next_priority;
        let next_faction;

        do {
            next_priority = pq.poll();
        } while (!desired_augmentations().includes(next_priority));

        while (next_priority && !next_faction) {
            // ns.tprint(next_priority.factions_offering, " ", next_priority.name);
            for (let faction_name of player.faction.membership) {
                let faction = factionFactory(faction_name); // heavy functions, but it's rare.
                faction.wanted_augs = desired_augmentations().filter(aug => aug.factions_offering.includes(faction.name));
                if (faction.wanted_augs.includes(next_priority)) {
                    next_faction = faction;
                    ns.tprint("Starting work for ", next_faction.name, " in pursuit of ", next_priority);
                    break;
                }
            }
            next_priority = pq.poll();
        }
        if (next_faction) {
            ns.workForFaction(next_faction.name, "Hacking Contracts", false);
        }
    }

    let end_time = performance.now();
    ns.tprint(end_time - start_time);
};

/**
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const buyBestAug = (ns, player) => {
    const pq = prioritize_augmentations(ns, player);
    let next_priority = pq.poll();
    // todo: consider whether it prioritizes a stat we want; 
    // this literally just buys available augs from most to least expensive
    let next_faction;
    let can_buy = new Map();

    while (next_priority && !next_faction) {
        // for (let faction_name of player.faction.membership) { 
        // let faction = factionFactory(faction_name);
        // now: only consider the faction we're currently working for
        let faction = factionFactory(player.work.current.factionName);
        faction.wanted_augs = desired_augmentations().filter(aug => aug.factions_offering.includes(faction.name));

        if (faction.wanted_augs.includes(next_priority)) {
            let considering = next_priority;
            considering.faction = faction;
            // ns.tprint("Considering whether we can purchase ", next_priority);
            if (faction.can_purchase_aug(player, next_priority)) {
                if (can_buy.has(next_priority.name)) { // i dunno, can prices vary?
                    let existing = can_buy.get(next_priority);
                    if (existing.price < considering.price) {
                        can_buy.set(next_priority.name, considering);
                    }
                } else {
                    can_buy.set(next_priority.name, considering);
                }
            }
        } 
        // }
        next_priority = pq.poll();
    }
    
    let can_buy_list = [...can_buy.values()];
    while (can_buy_list.length > 0) {
        can_buy_list.sort((a,b) => b.price - a.price);
        let next_buy = can_buy_list.shift();
        ns.tprint("Attempting purchase of next priority... ", next_buy.name, " from ", next_buy.faction.name);
        next_buy.faction.purchase_aug(next_buy.name);
        player.queued_augmentations.push(next_buy);
    }
    return player;
};