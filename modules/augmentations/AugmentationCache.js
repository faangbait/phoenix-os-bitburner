/**
 * Note: File meant to be zero-ram and imported
 */
import { Cache, PORTS } from "lib/Database";
export const AugCache = {
    all(ns) {
        return Cache.all(ns, PORTS.augmentations);
    },
    read(ns, id) {
        return Cache.read(ns, PORTS.augmentations, id);
    },
    async update(ns, obj) {
        return await Cache.update(ns, PORTS.augmentations, obj);
    },
    async delete(ns, id) {
        return await Cache.delete(ns, PORTS.augmentations, id);
    },
};
