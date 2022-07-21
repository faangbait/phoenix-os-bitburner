/**
 * This file uses only Enums and Cache files, which makes it zero-ram.
 * It can use other functions that are already present on the server, like exec, ServerInfo, and PlayerInfo.
 */
import { TermLogger } from "lib/Logger";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
import { AugCache } from "modules/augmentations/AugmentationCache";
import { AugmentationNames } from "modules/augmentations/AugmentationEnums";
export const AugmentationFuncs = {
    calculate_costs(ns, augmentations) {
        function augsort(ns, sorted, unsorted) {
            let work = [];
            let cant = [];
            let owned_reqs = Array.from(AugCache.all(ns).values()).filter(a => a.owned);
            for (const a of unsorted) {
                if (a.prereqs.every(req => owned_reqs.includes(AugmentationNames[req]))) {
                    work.push(a);
                }
                else {
                    cant.push(a);
                }
            }
            return [...sorted, ...work.sort((a, b) => b.baseCost - a.baseCost), ...cant];
        }
        let aug_set = new Set(augmentations);
        augmentations.forEach(a => a.prereqs.forEach(p => aug_set.add(AugmentationNames[p])));
        augmentations = Array.from(aug_set.values());
        let sorted = [];
        while (sorted.length < augmentations.length) {
            sorted = augsort(ns, sorted, augmentations);
        }
        let queued_count = 0;
        let bn = BitNodeCache.read(ns, "current");
        return sorted.reduce((acc, cur) => {
            let res = cur.baseCost * Math.pow(1.9, queued_count) * bn.multipliers.augmentations.money;
            queued_count++;
            return acc + res;
        }, 0);
    },
    get_augmentation_path(ns) {
        let aug_list = AugCache.all(ns);
        const add = (filtered_augs, aug) => {
            let aug_obj = aug_list.get(AugmentationNames[aug]);
            if (aug_obj) {
                filtered_augs.set(AugmentationNames[aug], aug_obj);
            }
            return filtered_augs;
        };
        let logger = new TermLogger(ns);
        let filt = new Map();
        switch (BitNodeCache.read(ns, "current").number) {
            case 1:
                // Hacknet
                add(filt, AugmentationNames.HacknetNodeCPUUpload);
                add(filt, AugmentationNames.HacknetNodeCacheUpload);
                add(filt, AugmentationNames.HacknetNodeCoreDNI);
                add(filt, AugmentationNames.HacknetNodeKernelDNI);
                add(filt, AugmentationNames.HacknetNodeNICUpload);
                // Hacking
                add(filt, AugmentationNames.CashRoot);
                add(filt, AugmentationNames.Neuralstimulator);
                add(filt, AugmentationNames.Neurotrainer1);
                add(filt, AugmentationNames.Neurotrainer2);
                add(filt, AugmentationNames.CranialSignalProcessorsG1);
                add(filt, AugmentationNames.CranialSignalProcessorsG2);
                add(filt, AugmentationNames.CranialSignalProcessorsG3);
                add(filt, AugmentationNames.CranialSignalProcessorsG4);
                add(filt, AugmentationNames.CranialSignalProcessorsG5);
                add(filt, AugmentationNames.BitWire);
                add(filt, AugmentationNames.SynapticEnhancement);
                add(filt, AugmentationNames.ArtificialSynapticPotentiation);
                add(filt, AugmentationNames.ENM);
                add(filt, AugmentationNames.ENMCore);
                add(filt, AugmentationNames.ENMCoreV2);
                add(filt, AugmentationNames.NeuralRetentionEnhancement);
                add(filt, AugmentationNames.CRTX42AA);
                add(filt, AugmentationNames.DataJack);
                add(filt, AugmentationNames.EnhancedMyelinSheathing);
                add(filt, AugmentationNames.TheBlackHand);
                add(filt, AugmentationNames.ArtificialBioNeuralNetwork);
                add(filt, AugmentationNames.NeuralAccelerator);
                add(filt, AugmentationNames.Neurolink);
                // Social
                add(filt, AugmentationNames.SNA);
                add(filt, AugmentationNames.ADRPheromone1);
                add(filt, AugmentationNames.Neuregen);
                // Post-Daedalus
                add(filt, AugmentationNames.ENMCoreV3);
                add(filt, AugmentationNames.ENMAnalyzeEngine);
                add(filt, AugmentationNames.ENMDMA);
                add(filt, AugmentationNames.TheRedPill);
                break;
            case 2:
                // Hacknet
                add(filt, AugmentationNames.HacknetNodeCPUUpload);
                add(filt, AugmentationNames.HacknetNodeCacheUpload);
                add(filt, AugmentationNames.HacknetNodeCoreDNI);
                add(filt, AugmentationNames.HacknetNodeKernelDNI);
                add(filt, AugmentationNames.HacknetNodeNICUpload);
                // Hacking
                add(filt, AugmentationNames.CashRoot);
                add(filt, AugmentationNames.Neuralstimulator);
                add(filt, AugmentationNames.Neurotrainer1);
                add(filt, AugmentationNames.Neurotrainer2);
                add(filt, AugmentationNames.CranialSignalProcessorsG1);
                add(filt, AugmentationNames.CranialSignalProcessorsG2);
                add(filt, AugmentationNames.CranialSignalProcessorsG3);
                add(filt, AugmentationNames.CranialSignalProcessorsG4);
                add(filt, AugmentationNames.CranialSignalProcessorsG5);
                add(filt, AugmentationNames.BitWire);
                add(filt, AugmentationNames.SynapticEnhancement);
                add(filt, AugmentationNames.ArtificialSynapticPotentiation);
                add(filt, AugmentationNames.ENM);
                add(filt, AugmentationNames.ENMCore);
                add(filt, AugmentationNames.ENMCoreV2);
                add(filt, AugmentationNames.NeuralRetentionEnhancement);
                add(filt, AugmentationNames.CRTX42AA);
                add(filt, AugmentationNames.DataJack);
                add(filt, AugmentationNames.EnhancedMyelinSheathing);
                add(filt, AugmentationNames.TheBlackHand);
                add(filt, AugmentationNames.ArtificialBioNeuralNetwork);
                add(filt, AugmentationNames.NeuralAccelerator);
                add(filt, AugmentationNames.Neurolink);
                // Social
                add(filt, AugmentationNames.SNA);
                add(filt, AugmentationNames.ADRPheromone1);
                add(filt, AugmentationNames.Neuregen);
                // Combat
                add(filt, AugmentationNames.LuminCloaking1);
                add(filt, AugmentationNames.LuminCloaking2);
                add(filt, AugmentationNames.SmartSonar);
                add(filt, AugmentationNames.PCMatrix);
                add(filt, AugmentationNames.INFRARet);
                add(filt, AugmentationNames.Targeting1);
                add(filt, AugmentationNames.Targeting2);
                add(filt, AugmentationNames.CombatRib1);
                add(filt, AugmentationNames.NanofiberWeave);
                add(filt, AugmentationNames.NutriGen);
                // Post Daedalus
                add(filt, AugmentationNames.GrapheneBrachiBlades);
                add(filt, AugmentationNames.BrachiBlades);
                add(filt, AugmentationNames.HemoRecirculator);
                add(filt, AugmentationNames.TheRedPill);
                break;
            case 3:
                // Hacknet
                add(filt, AugmentationNames.HacknetNodeCPUUpload);
                add(filt, AugmentationNames.HacknetNodeCacheUpload);
                add(filt, AugmentationNames.HacknetNodeCoreDNI);
                add(filt, AugmentationNames.HacknetNodeKernelDNI);
                add(filt, AugmentationNames.HacknetNodeNICUpload);
                // Hacking
                add(filt, AugmentationNames.CashRoot);
                add(filt, AugmentationNames.Neuralstimulator);
                add(filt, AugmentationNames.Neurotrainer1);
                add(filt, AugmentationNames.Neurotrainer2);
                add(filt, AugmentationNames.CranialSignalProcessorsG1);
                add(filt, AugmentationNames.CranialSignalProcessorsG2);
                add(filt, AugmentationNames.CranialSignalProcessorsG3);
                add(filt, AugmentationNames.CranialSignalProcessorsG4);
                add(filt, AugmentationNames.CranialSignalProcessorsG5);
                add(filt, AugmentationNames.BitWire);
                add(filt, AugmentationNames.SynapticEnhancement);
                add(filt, AugmentationNames.ArtificialSynapticPotentiation);
                add(filt, AugmentationNames.ENM);
                add(filt, AugmentationNames.ENMCore);
                add(filt, AugmentationNames.ENMCoreV2);
                add(filt, AugmentationNames.NeuralRetentionEnhancement);
                add(filt, AugmentationNames.CRTX42AA);
                add(filt, AugmentationNames.DataJack);
                add(filt, AugmentationNames.EnhancedMyelinSheathing);
                add(filt, AugmentationNames.TheBlackHand);
                add(filt, AugmentationNames.ArtificialBioNeuralNetwork);
                add(filt, AugmentationNames.NeuralAccelerator);
                add(filt, AugmentationNames.Neurolink);
                // Social
                add(filt, AugmentationNames.SNA);
                add(filt, AugmentationNames.ADRPheromone1);
                // Post Daedalus
                add(filt, AugmentationNames.TheRedPill);
                break;
            case 4:
                // Hacking
                add(filt, AugmentationNames.CashRoot);
                add(filt, AugmentationNames.Neuralstimulator);
                add(filt, AugmentationNames.Neurotrainer1);
                add(filt, AugmentationNames.Neurotrainer2);
                add(filt, AugmentationNames.CranialSignalProcessorsG1);
                add(filt, AugmentationNames.CranialSignalProcessorsG2);
                add(filt, AugmentationNames.CranialSignalProcessorsG3);
                add(filt, AugmentationNames.CranialSignalProcessorsG4);
                add(filt, AugmentationNames.CranialSignalProcessorsG5);
                add(filt, AugmentationNames.BitWire);
                add(filt, AugmentationNames.SynapticEnhancement);
                add(filt, AugmentationNames.ArtificialSynapticPotentiation);
                add(filt, AugmentationNames.ENM);
                add(filt, AugmentationNames.ENMCore);
                add(filt, AugmentationNames.ENMCoreV2);
                add(filt, AugmentationNames.NeuralRetentionEnhancement);
                add(filt, AugmentationNames.CRTX42AA);
                add(filt, AugmentationNames.DataJack);
                add(filt, AugmentationNames.EnhancedMyelinSheathing);
                add(filt, AugmentationNames.TheBlackHand);
                add(filt, AugmentationNames.ArtificialBioNeuralNetwork);
                add(filt, AugmentationNames.NeuralAccelerator);
                add(filt, AugmentationNames.Neurolink);
                // ?
                // ?
                // ?
                // ?
                // ?
                // Post Daedalus
                add(filt, AugmentationNames.TheRedPill);
                break;
            case 5:
                // Hacknet
                add(filt, AugmentationNames.HacknetNodeCPUUpload);
                add(filt, AugmentationNames.HacknetNodeCacheUpload);
                add(filt, AugmentationNames.HacknetNodeCoreDNI);
                add(filt, AugmentationNames.HacknetNodeKernelDNI);
                add(filt, AugmentationNames.HacknetNodeNICUpload);
                // Hacking
                add(filt, AugmentationNames.CashRoot);
                add(filt, AugmentationNames.Neuralstimulator);
                add(filt, AugmentationNames.Neurotrainer1);
                add(filt, AugmentationNames.Neurotrainer2);
                add(filt, AugmentationNames.CranialSignalProcessorsG1);
                add(filt, AugmentationNames.CranialSignalProcessorsG2);
                add(filt, AugmentationNames.CranialSignalProcessorsG3);
                add(filt, AugmentationNames.CranialSignalProcessorsG4);
                add(filt, AugmentationNames.CranialSignalProcessorsG5);
                add(filt, AugmentationNames.BitWire);
                add(filt, AugmentationNames.SynapticEnhancement);
                add(filt, AugmentationNames.ArtificialSynapticPotentiation);
                add(filt, AugmentationNames.ENM);
                add(filt, AugmentationNames.ENMCore);
                add(filt, AugmentationNames.ENMCoreV2);
                add(filt, AugmentationNames.NeuralRetentionEnhancement);
                add(filt, AugmentationNames.CRTX42AA);
                add(filt, AugmentationNames.DataJack);
                add(filt, AugmentationNames.EnhancedMyelinSheathing);
                add(filt, AugmentationNames.TheBlackHand);
                add(filt, AugmentationNames.ArtificialBioNeuralNetwork);
                add(filt, AugmentationNames.NeuralAccelerator);
                add(filt, AugmentationNames.Neurolink);
                // Social
                add(filt, AugmentationNames.SNA);
                add(filt, AugmentationNames.ADRPheromone1);
                // Post Daedalus
                add(filt, AugmentationNames.TheRedPill);
                break;
            default:
                logger.err("Lost BitNode cache, can't determine current bitnode");
                break;
        }
        return filt;
    }
};
// case 6: //35 / 6000
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     // Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire,
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand,
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     // Bladerunner
//                     AUGMENTATIONS.EsperEyewear,
//                     AUGMENTATIONS.EMS4Recombination,
//                     AUGMENTATIONS.OrionShoulder,
//                     AUGMENTATIONS.HyperionV1,
//                     AUGMENTATIONS.HyperionV2,
//                     AUGMENTATIONS.GolemSerum,
//                     AUGMENTATIONS.VangelisVirus,
//                     AUGMENTATIONS.VangelisVirus3,
//                     AUGMENTATIONS.INTERLINKED,
//                     AUGMENTATIONS.BladeRunner,
//                     AUGMENTATIONS.BladeArmor,
//                     AUGMENTATIONS.BladeArmorEnergyShielding,
//                     AUGMENTATIONS.BladeArmorUnibeam,
//                     AUGMENTATIONS.BladeArmorIPU,
//                     AUGMENTATIONS.BladeArmorPowerCells,
//                     AUGMENTATIONS.BladesSimulacrum,
//                     //Combat
//                     AUGMENTATIONS.Targeting1,
//                     AUGMENTATIONS.Targeting2,
//                     AUGMENTATIONS.WiredReflexes,
//                     // Socila
//                     AUGMENTATIONS.SNA,
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.TheRedPill
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
//         case 7: //35 / 6000
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     //Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire,
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand,
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     //Bladerunner
//                     AUGMENTATIONS.EsperEyewear,
//                     AUGMENTATIONS.EMS4Recombination,
//                     AUGMENTATIONS.OrionShoulder,
//                     AUGMENTATIONS.HyperionV1,
//                     AUGMENTATIONS.HyperionV2, 
//                     AUGMENTATIONS.GolemSerum,
//                     AUGMENTATIONS.VangelisVirus,
//                     AUGMENTATIONS.VangelisVirus3,
//                     AUGMENTATIONS.INTERLINKED,
//                     AUGMENTATIONS.BladeRunner, 
//                     AUGMENTATIONS.BladeArmor,
//                     AUGMENTATIONS.BladeArmorEnergyShielding,
//                     AUGMENTATIONS.BladeArmorUnibeam,
//                     AUGMENTATIONS.BladeArmorIPU,
//                     AUGMENTATIONS.BladeArmorPowerCells, 
//                     AUGMENTATIONS.BladesSimulacrum,
//                     // Combat
//                     AUGMENTATIONS.Targeting1,
//                     AUGMENTATIONS.Targeting2,
//                     AUGMENTATIONS.WiredReflexes, 
//                     // Social
//                     AUGMENTATIONS.SNA,
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.TheRedPill
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
//         case 8: // 30/3000
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     // Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire, // 10
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand, // 20
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     // Social
//                     AUGMENTATIONS.SNA,
//                     AUGMENTATIONS.ADRPheromone1, // 25
//                     AUGMENTATIONS.Neuregen,
//                     // Combat
//                     AUGMENTATIONS.Targeting1,
//                     AUGMENTATIONS.WiredReflexes,
//                     AUGMENTATIONS.SpeechEnhancement,
//                     AUGMENTATIONS.HacknetNodeCPUUpload,
//                     AUGMENTATIONS.HacknetNodeCacheUpload,
//                     AUGMENTATIONS.HacknetNodeCoreDNI,
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.ENMCoreV3,
//                     AUGMENTATIONS.ENMAnalyzeEngine,
//                     AUGMENTATIONS.ENMDMA,
//                     AUGMENTATIONS.TheRedPill,
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
//         case 9: // 30 /6000
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     // Hacknet
//                     AUGMENTATIONS.HacknetNodeCPUUpload,
//                     AUGMENTATIONS.HacknetNodeCacheUpload,
//                     AUGMENTATIONS.HacknetNodeCoreDNI,
//                     AUGMENTATIONS.HacknetNodeKernelDNI, 
//                     AUGMENTATIONS.HacknetNodeNICUpload, //5
//                     // Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire,
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand,
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     // Social
//                     AUGMENTATIONS.SNA,
//                     AUGMENTATIONS.ADRPheromone1,
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.TheRedPill
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
//         case 10: // 30/6000
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     // Hacknet                    
//                     AUGMENTATIONS.HacknetNodeCPUUpload,
//                     AUGMENTATIONS.HacknetNodeCacheUpload,
//                     AUGMENTATIONS.HacknetNodeCoreDNI,
//                     AUGMENTATIONS.HacknetNodeKernelDNI, 
//                     AUGMENTATIONS.HacknetNodeNICUpload, //5
//                     // Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire,
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand,
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     // Social
//                     AUGMENTATIONS.SNA,
//                     AUGMENTATIONS.ADRPheromone1,
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.TheRedPill
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
//         case 11: // 30/4500
//             filtered_augs = aug_list.filter(a => 
//                 [
//                     // Hacking
//                     AUGMENTATIONS.CashRoot,
//                     AUGMENTATIONS.Neuralstimulator,
//                     AUGMENTATIONS.Neurotrainer1,
//                     AUGMENTATIONS.Neurotrainer2,
//                     AUGMENTATIONS.CranialSignalProcessorsG1,
//                     AUGMENTATIONS.CranialSignalProcessorsG2,
//                     AUGMENTATIONS.CranialSignalProcessorsG3,
//                     AUGMENTATIONS.CranialSignalProcessorsG4,
//                     AUGMENTATIONS.CranialSignalProcessorsG5,
//                     AUGMENTATIONS.BitWire,
//                     AUGMENTATIONS.SynapticEnhancement,
//                     AUGMENTATIONS.ArtificialSynapticPotentiation,
//                     AUGMENTATIONS.ENM,
//                     AUGMENTATIONS.ENMCore,
//                     AUGMENTATIONS.ENMCoreV2,
//                     AUGMENTATIONS.NeuralRetentionEnhancement,
//                     AUGMENTATIONS.CRTX42AA,
//                     AUGMENTATIONS.DataJack,
//                     AUGMENTATIONS.EnhancedMyelinSheathing,
//                     AUGMENTATIONS.TheBlackHand,
//                     AUGMENTATIONS.ArtificialBioNeuralNetwork,
//                     AUGMENTATIONS.NeuralAccelerator,
//                     AUGMENTATIONS.Neurolink,
//                     // Social
//                     AUGMENTATIONS.SNA,
//                     AUGMENTATIONS.ADRPheromone1,
//                     // ?
//                     // ?
//                     // ?
//                     // ?
//                     // ?
//                     // Always
//                     AUGMENTATIONS.NeuroFluxGovernor,
//                     // POST DAEDALUS
//                     AUGMENTATIONS.TheRedPill
//                 ].includes(AUGMENTATIONS[a])
//                 )
//             break;
