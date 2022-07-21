import { AugmentationNames, Augmentations } from "modules/augmentations/AugmentationEnums";
class Augmentation {
    constructor(ns, name) {
        this.baseCost = 0;
        this.baseRepRequirement = 0;
        this.name = "";
        this.prereqs = [];
        this.factions = [];
        this.owned = false;
        this.installed = false;
        this.id = AugmentationNames[name];
        this.name = name;
        this.prereqs = this.prereqs ? this.prereqs : [];
        this.stats = {
            agility: {
                exp: 1,
                level: 1,
            },
            charisma: {
                exp: 1,
                level: 1,
            },
            defense: {
                exp: 1,
                level: 1,
            },
            dexterity: {
                exp: 1,
                level: 1,
            },
            strength: {
                exp: 1,
                level: 1,
            },
            bladeburner: {
                analysis: 1,
                max_stam: 1,
                stam_gain: 1,
                success: 1,
            },
            crime: {
                money: 1,
                success: 1,
            },
            company: {
                rep: 1,
                work: 1,
            },
            faction: {
                rep: 1,
            },
            hacking: {
                chance: 1,
                exp: 1,
                grow: 1,
                money: 1,
                level: 1,
                speed: 1,
            },
            hacknet: {
                core: 1,
                level: 1,
                node: 1,
                ram: 1,
                production: 1,
            }
        };
    }
}
// export const AugModule = {
//     async init(ns: NS) {},
//     async loop(ns: NS) {},
//     all(ns: NS) {},
//     detail(ns: NS) {},
//     calculate_costs(augmentations: Augmentation[]): number {},
//     create_augmentation_graph(augmentations: Augmentation[]): Graph {},
//     generate_fastest_route(augmentation_graph: Graph): Augmentation[] {}
// }
/**
 * Returns a list of Augmentation objects
 */
export const AugmentationInfo = {
    all(ns) {
        for (const aug_name in AugmentationNames) {
            Augmentations[aug_name] = AugmentationInfo.detail(ns, aug_name);
        }
        return Augmentations;
    },
    detail(ns, aug_name) {
        return new Augmentation(ns, aug_name);
    }
};
