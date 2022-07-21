import { BitnodeInfo } from "modules/bitnodes/Bitnodes";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
export const main = async (ns) => {
    const bitnodes = BitnodeInfo.all(ns);
    for (const bn of bitnodes.values()) {
        await BitNodeCache.update(ns, bn);
    }
};
