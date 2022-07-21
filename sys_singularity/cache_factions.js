import { FactionInfo } from "modules/factions/Factions";
import { FactionCache } from "modules/factions/FactionCache";
export const main = async (ns) => {
    const factions = FactionInfo.all(ns);
    for (const fact of factions.values()) {
        fact.invited = ns.singularity.checkFactionInvitations().includes(fact.name);
        fact.augmentations = ns.singularity.getAugmentationsFromFaction(fact.name);
        await FactionCache.update(ns, fact);
    }
};
