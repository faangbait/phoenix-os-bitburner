/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const PlayerCache = {
    all(ns) {
        return Cache.all(ns, PORTS.players);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.players, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.players, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.players, id);
    }
};
