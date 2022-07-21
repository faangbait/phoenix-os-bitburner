/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const StockCache = {
    all(ns) {
        return Cache.all(ns, PORTS.stocks);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.stocks, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.stocks, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.stocks, id);
    }
};
