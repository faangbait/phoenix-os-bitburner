/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const ServerCache = {
    all(ns) {
        return Cache.all(ns, PORTS.servers);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.servers, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.servers, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.servers, id);
    }
};
