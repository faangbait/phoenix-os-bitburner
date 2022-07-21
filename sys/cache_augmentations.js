import { AugmentationInfo } from "modules/augmentations/Augmentations";
import { AugCache } from "modules/augmentations/AugmentationCache";
export const main = async (ns) => {
    const augmentations = AugmentationInfo.all(ns);
    for (const aug of augmentations.values()) {
        await AugCache.update(ns, aug);
    }
};
