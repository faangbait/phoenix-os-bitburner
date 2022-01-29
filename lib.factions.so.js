/**
 * @typedef {import(".").NS} ns
 */

/**
 * Faction class holds information about a faction, including aug list, rep, favor, etc.
 * 
 * @class Faction
 */
 export class Faction {
     /**
      * A faction can represent a faction, company, or a criminal organization.
      * Basically, anything that's joinable. Companies or other specialized types of
      * factions can be subclassed later.
      * 
      * @param {ns} ns 
      * @param {string} name 
      */
    constructor(ns, name) {
        this.name = name;
        this.ns = ns;
    }

    /**
     * Returns a list of augmentations this faction offers.
     * Potentially deprecable in favor of a ram-free option like a static list,
     * however, I think the augmentation list can change over time. It's unlikely to change
     * mid-reboot, so it could be part of the startup script to write to disk.
     *
     * @readonly
     * @memberof Faction
     * @return {string[]} augmentation list
     */
    get aug_list() {
        return this.ns.getAugmentationsFromFaction(this.name);
    }

    /**
     * Returns the amount of rep we have with this faction.
     *
     * @readonly
     * @memberof Faction
     */
    get rep() {
        return this.ns.getFactionRep(this.name);
    }

    // /**
    //  * Returns a map of augmentations available from this faction that you don't
    //  * yet own.
    //  *
    //  * @readonly
    //  * @memberof Faction
    //  * @return {Map<aug_name, {name, price, prereq, repreq, stats}>} augmentation graph
    //  */
    // get unowned_augs() {
    //     let augs = this.aug_list;
    //     let owned_augs = this.ns.getOwnedAugmentations(true);
    //     let unowned_faction_augs = [];
    //     const augmentation_graph = new Map();

    //     for (let aug of augs) {
    //         if (!owned_augs.includes(aug)) {
    //             unowned_faction_augs.push(aug);
    //         }
    //     }

    //     for (let unowned_aug of unowned_faction_augs) {
    //         augmentation_graph.set(unowned_aug, {
    //             name: unowned_aug,
    //             price:  this.ns.getAugmentationPrice(unowned_aug),
    //             prereq: this.ns.getAugmentationPrereq(unowned_aug),
	// 			repreq: this.ns.getAugmentationRepReq(unowned_aug),
    //             stats: this.ns.getAugmentationStats(unowned_aug),
    //          });
    //     }
    //     return augmentation_graph;
    // }

    // /**
    //  * Returns the list of augmentations this faction offers that match a desired priority stat.
    //  * To-do: Deprecate priority_stat in favor of a calculated function.
    //  * Potentially deprecate entire function in favor of a more global, faction-independent wanted-augs func.
    //  *
    //  * @param {*} priority_stat
    //  * @return {*} 
    //  * @memberof Faction
    //  */
    // get_wanted_augs(priority_stat) {
    //     wanted_augs = [];
    //     for (let aug of this.unowned_augs.values()) {
    //         if (aug.stats.hasOwnProperty(priority_stat)) {
    //             wanted_augs.push(aug);
    //         }
    //     }
    //     return wanted_augs;
    // }

    /**
     *
     *
     * @param {import("./phoenix-doc").PlayerObject} player
     * @param {string} aug_name
     * @memberof Faction
     */
    can_purchase_aug(player, aug) {
        if (this.aug_list.includes(aug.name)) {
            if (
                (player.money >= aug.price) && 
                (this.ns.getOwnedAugmentations(true).includes(aug.prereq)[0] || aug.prereq.length == 0) &&
                (this.rep >= aug.rep)
                ) {
                    return true;
                } else {
                    // this.ns.tprint("Can't buy ", aug_name, " because ", (player.money >= aug_info.price), (this.ns.getOwnedAugmentations(true).includes(aug_info.prereq) || !aug_info.prereq), (this.rep >= aug_info.repreq));
                    return false;
                }
        }
    }
    /**
     * Purchases an augmentation.
     *
     * @param {string} aug_name
     * @return {boolean} 
     * @memberof Faction
     */
    purchase_aug(aug) {
        if (this.aug_list.includes(aug.name)) {
            return this.ns.purchaseAugmentation(this.name, aug.name);
        } else {
            return false;
        }
    }
}

/**
 * Returns a Faction instance given a name.
 * 
 * @param {string} faction_name 
 * @return {Faction}
 */
export default function factionFactory(faction_name) {
    return new Faction(globalThis.ns, faction_name);
}

