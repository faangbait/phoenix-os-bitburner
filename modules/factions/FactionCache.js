/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const FactionCache = {
    all(ns) {
        return Cache.all(ns, PORTS.factions);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.factions, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.factions, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.factions, id);
    }
};
