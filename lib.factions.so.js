
/**
 * Faction class holds information about a faction, including aug list, rep, favor, etc.
 * 
 * @class Faction
 */
 export class Faction {
     /**
      * 
      * @param {ns} ns 
      * @param {string} name 
      */
    constructor(ns, name) {
        this.name = name;
        this.ns = ns;
    }

    /**
     *
     *
     * @readonly
     * @memberof Faction
     * @return {string[]} augmentation list
     */
    get aug_list() {
        return this.ns.getAugmentationsFromFaction(this.name);
    }

    get rep() {
        return this.ns.getFactionRep(this.name);
    }

    /**
     * Returns a map of augmentations available from this faction that you don't
     * yet own.
     *
     * @readonly
     * @memberof Faction
     * @return {Map<aug_name, {name, price, prereq, repreq, stats}>} augmentation graph
     */
    get unowned_augs() {
        let augs = this.aug_list;
        let owned_augs = this.ns.getOwnedAugmentations(true);
        let unowned_faction_augs = [];
        const augmentation_graph = new Map();

        for (let aug of augs) {
            if (!owned_augs.includes(aug)) {
                unowned_faction_augs.push(aug);
            }
        }

        for (let unowned_aug of unowned_faction_augs) {
            augmentation_graph.set(unowned_aug, {
                name: unowned_aug,
                price:  this.ns.getAugmentationPrice(unowned_aug),
                prereq: this.ns.getAugmentationPrereq(unowned_aug),
				repreq: this.ns.getAugmentationRepReq(unowned_aug),
                stats: this.ns.getAugmentationStats(unowned_aug),
             });
        }
        return augmentation_graph;
    }

    can_purchase_aug(player, aug_name) {
        if (this.unowned_augs.has(aug_name)) {
            let aug_info = this.unowned_augs.get(aug_name);
            if (
                (player.money > aug_info.price) && 
                (ns.getOwnedAugmentations(true).includes(aug_info.prereq)) &&
                (this.rep >= aug_info.repreq)
                ) {
                    return true;
                } else {
                    return false;
                }
            
        } else {
            globalThis.ns.tprint("ERROR: Already own ", aug_name);
        }
    }
    /**
     * Purchases an augmentation
     *
     * @param {string} aug_name
     * @return {boolean} 
     * @memberof Faction
     */
    purchase_aug(aug_name) {
        if (this.unowned_augs.has(aug_name)) {
            return this.ns.purchaseAugmentation(this.name, aug_name);
        } else {
            return false;
        }
        
    }
}


/**
 * Returns a Faction instance given a name
 * 
 * @param {string} faction_name 
 * @return {Faction}
 */
export default function factionFactory(faction_name) {
    return new Faction(globalThis.ns, faction_name);
}
