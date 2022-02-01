/**
 * @typedef {import(".").NS} ns
 */
import { PriorityQueue } from "./lib.structures.so";
import { faction_blockers } from "./var.constants";
import { loop_time } from "./var.constants";

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

function growth ( known_y, known_x, new_x, use_const ) {
    // default values for optional parameters:
    if ( typeof( known_x ) == 'undefined' ) {
        known_x = [];
        for ( var i = 1; i <= known_y.length; i++ ) known_x.push(i);
    }
    if ( typeof( new_x ) == 'undefined' ) {
        new_x = [];
        for ( var i = 1; i <= known_y.length; i++ ) new_x.push(i);
    }
    if ( typeof( use_const ) == 'undefined' ) use_const = true;

    // calculate sums over the data:
    var n = known_y.length;
    var avg_x = 0; var avg_y = 0; var avg_xy = 0; var avg_xx = 0; 
    for ( var i = 0; i < n; i++ ) {
        var x = known_x[i]; var y = Math.log( known_y[i] );
        avg_x += x; avg_y += y; avg_xy += x*y; avg_xx += x*x;
    }
    avg_x /= n; avg_y /= n; avg_xy /= n; avg_xx /= n;

    // compute linear regression coefficients:
    if ( use_const ) {
        var beta = (avg_xy - avg_x*avg_y) / (avg_xx - avg_x*avg_x);
        var alpha = avg_y - beta*avg_x;
    } else {
        var beta = avg_xy / avg_xx;
        var alpha = 0;
    }

    // compute and return result array:
    var new_y = [];
    for ( var i = 0; i < new_x.length; i++ ) {
        new_y.push( Math.exp( alpha + beta * new_x[i] ) );
    }
    return new_y;
}


export function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

/**
 *
 *
 * @param {import("./phoenix-doc").PlayerObject[]} player_history
 * @param {string} stat
 * @return {*} 
 */
function history_mapreduce(player_history, stat) {
    let deepsplit = stat.split(".");

    if (player_history.length < 100) {
        return 0;
    }
    
    let change = player_history.map(function (h) {
        for (let split of deepsplit) {
            h = h[split];
        }
        return h;
    });
    
    var known_y = change;
    var known_x = [...Array(100).keys()].map(i => i + 0);
    var new_x = [...Array(400).keys()].map(i => i + 0);
    var new_y = growth(known_y, known_x, new_x);

    var results = [];
    for ( var i = 0; i < new_x.length; i++ ) {
        results.push( new_y[i] );
    }

    return results;
    // // let rate_of_change = Math.exp(
    // //     Math.log(change[(player_history.length - 1)] / change[0]) / (player_history.length - 1)
    // //         );
    

    // return rate_of_change;
}

function get_targeted_augment(ns, player) {
    let next_priority;
    let next_faction;
    let selected_next;
    const pq = prioritize_augmentations(ns, player);

    do {
        next_priority = pq.poll();
    } while (!desired_augmentations().includes(next_priority));

    while (next_priority && !next_faction) {
        // ns.tprint(next_priority.factions_offering, " ", next_priority.name);
        for (let faction_name of player.faction.membership) {
            if (desired_augmentations().filter(aug => aug.factions_offering.includes(faction_name)).includes(next_priority)) {
                next_faction = faction_name;
                selected_next = next_priority;
                break;
            }
        }
        next_priority = pq.poll();
    }
    if (next_faction) {
        return selected_next;
    }
    return null;

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
    let distance = 0;
    let history = player.rate_of_change.player.slice(-100);
    if (history.length == 100) {

        let ymoney = history_mapreduce(history, "money");
        let yhacking_exp = history_mapreduce(history, "hacking.exp");

        let _1hr_money = ymoney.slice(-1)[0];
        let _1hr_hacking_exp = yhacking_exp.slice(-1)[0];
        
        
        
        let minute = 1000 * 60;
        let tpm = minute / loop_time; // number of ticks per minute
    
        // let _1hr_money = player.money * (1+money)^(tpm * 60);
        // let _1hr_xp = player.hacking.exp * (1+hacking_exp)^(tpm * 60);
        // let _1hr_rep = null;
        
        ns.tprint("Money EV: ", ns.nFormat(_1hr_money - player.money, "0.00a"), "/hr     XP EV: ", ns.nFormat(_1hr_hacking_exp - player.hacking.exp,"0.00a"), "/hr     Rep EV: ");
        // ns.tprint("Money rate of change: ", ns.nFormat(money, "0.000"), "%     XP rate of change: ", ns.nFormat(hacking_exp,"0.000"), "%     Rep rate of change: ");
        
        let targeted_augment = get_targeted_augment(ns, player);
        if (targeted_augment) {
            let price_delta = targeted_augment.price - player.money;
        }
        
        // let price_delta = targeted_augment.price;
        let money_growth=0;

        // for (distance=0; distance < 3000; distance++) {
        //     // money_growth = player.money * (1+money)^(tpm * distance);
        //     if (money_growth > price_delta) {
        //         break;
        //     }

        // }
    
        // ns.tprint("Time to next augment (", targeted_augment.name ,"): ", distance, " minutes? ", targeted_augment.price);
    }

    
    return distance;
}