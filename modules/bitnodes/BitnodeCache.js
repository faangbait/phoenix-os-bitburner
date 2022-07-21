/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const BitNodeCache = {
    all(ns) {
        return Cache.all(ns, PORTS.bitnodes);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.bitnodes, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.bitnodes, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.bitnodes, id);
    }
};
