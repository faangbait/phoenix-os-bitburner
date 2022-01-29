/**
 * @typedef {import(".").NS} ns
 */
import { PriorityQueue } from "./lib.structures.so";
import { faction_blockers } from "./var.constants";


class Augmentation {

    /**
     * Creates an instance of Augmentation.
     * @param {string} name
     * @memberof Augmentation
     */

    constructor(name) {
        this.name = name;
        this.ns = globalThis.ns;
    }

    get price() {
        return this.ns.getAugmentationPrice(this.name);
    }

    get prereq() {
        return this.ns.getAugmentationPrereq(this.name);
    }

    get rep() {
        return this.ns.getAugmentationRepReq(this.name);
    }

    get stats() {
        return this.ns.getAugmentationStats(this.name);
    }

    stat(stat_name) {
        if (this.has_stat(stat_name)) {
            return this.stats[stat_name];
        }
    }

    get owned() {
        return this.ns.getOwnedAugmentations(true).includes(this.name);
    }

    get installed() {
        return this.ns.getOwnedAugmentations(false).includes(this.name);
    }

    has_stat(stat_name) {
        return this.stats.hasOwnProperty(stat_name);
    }

    get factions_offering() {
        let offering_factions = [];
        for (const [faction, blockers] of faction_blockers) {
            if (this.ns.getAugmentationsFromFaction(faction).includes(this.name)) {
                offering_factions.push(faction);
            }
        }
        return offering_factions;
    }

    purchase(faction_name) {
        return this.ns.purchaseAugmentation(faction_name, this.name);
    }
}

var augmentation_cache=[];


/**
 * Defines the standard object representing an augmentation.
 * Other functions should load information about augmentations from this library.
 *
 * @export
 * @param {ns} ns
 * @param {import("./phoenix-doc").PlayerObject} player
 */
export function augmentations() {
    if (!augmentation_cache.length) {
    	for (const [faction, blockers] of faction_blockers) {
            for (let aug of globalThis.ns.getAugmentationsFromFaction(faction)) {
                augmentation_cache.push(new Augmentation(aug));
                }
            }
    }
    return augmentation_cache;
}

/**
 * 
 * Gets a list of augmentations that match a stat
 * 
 * 
 * @param {PlayerObject} player 
 * @param {string} priority_stat - the name of a stat, e.g. hacking_mult
 * @returns {Augmentation[]} desired augs by name
 * 
 */
export function desired_augmentations(priority_stat="hacking_mult") {
    return augmentations().filter(aug => aug.has_stat(priority_stat) && !aug.owned);
}

/**
 * Creates a priority queue for augmentations.
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const prioritize_augmentations = (ns, player) => {
    const pq = new PriorityQueue();
    for (let aug of augmentations()) {
        if (aug.name == "NeuroFlux Governor") {
            continue;
        }

        // now we have to reduce the value of an augmentation to a 0-20 number...
        // that determines in which order we want to pursue the augmentation...
        // probably should do it logarithmically...
        // probably add in faction favor and current cash per second as modifiers to these numbers
        let priority = (Math.log(aug.price) / Math.log(10)) + (Math.log(aug.rep) / Math.log(4));
        priority = Math.min(Math.ceil(priority), 20);

        // this feels like a good formula, since we can do some math on the pq. for instance,
        // it would make sense to consider [all] a factions' augmentations at the priority
        // value of its [most expensive] aug, since getting there will get you all the lower ranked augs
        pq.add(aug, priority);
    }
    
    return pq;
};

/**
 *
 *
 * @param {import("./phoenix-doc").PlayerObject[]} player_history
 * @param {string} stat
 * @return {*} 
 */
function history_mapreduce(player_history, stat) {
    let deepsplit = stat.split(".");

    if (player_history.length < 10) {
        return 0;
    }
    
    let change = player_history.map(function (h) {
        for (let split of deepsplit) {
            h = h[split];
        }
        return h;
    });
    

    let rate_of_change = Math.exp(Math.log(change[9]/change[0])/9);
    

    return rate_of_change;
}

/**
 * Calculates delta-T from historical values to get an exponential factor
 *
 * @export
 * @param {ns} ns
 * @param {import("./phoenix-doc").PlayerObject} player
 * @param {import("./phoenix-doc").ServerObject[]} servers
 * @return {*} 
 */
export function get_distance_to_next_augment(ns, player, servers) {
    let distance = Number.MAX_SAFE_INTEGER;

    let history = player.rate_of_change.player.slice(-10);
    let money = history_mapreduce(history, "money");
    let hacking_exp = history_mapreduce(history, "hacking.exp");
    
    ns.tprint("Money rate of change: ", money);
    ns.tprint("XP rate of change: ", hacking_exp);
    
    return distance;
}