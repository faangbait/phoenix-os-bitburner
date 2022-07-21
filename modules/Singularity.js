import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
export const Sing = {
    has_access(ns) {
        return Array.from(BitNodeCache.all(ns).values()).some(bn => bn.number == 4);
    }
};
