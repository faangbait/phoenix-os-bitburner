import { FactionInfo } from "modules/factions/Factions";
import { FactionCache } from "modules/factions/FactionCache";
export const main = async (ns) => {
    const factions = FactionInfo.all(ns);
    for (const fact of factions.values()) {
        await FactionCache.update(ns, fact);
    }
};
