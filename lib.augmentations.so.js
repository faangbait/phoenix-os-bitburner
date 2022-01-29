import factionFactory, { Faction } from "./lib.factions.so";
import { PriorityQueue } from "./lib.structures.so";

export default function loadAugmentationData (ns, player) {
    /** @param {ns} ns **/

    const faction_graph = new Map();

	faction_graph.set("Sector-12", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]);
	faction_graph.set("Chongqing", ["Sector-12", "Aevum", "Volhaven"]);
	faction_graph.set("New Tokyo", ["Sector-12", "Aevum", "Volhaven"]);
	faction_graph.set("Ishima", ["Sector-12", "Aevum", "Volhaven"]);
	faction_graph.set("Aevum", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]);
	faction_graph.set("Volhaven", ["Chongqing", "New Tokyo", "Ishima", "Sector-12", "Aevum"]);
	faction_graph.set("NiteSec", []);
	faction_graph.set("CyberSec", []);
	faction_graph.set("Tian Di Hui", []);
	faction_graph.set("BitRunners", []);
	faction_graph.set("ECorp", []);
	faction_graph.set("The Black Hand", []);
	faction_graph.set("KuaiGong International", []);
	faction_graph.set("MegaCorp", []);
	faction_graph.set("NWO", []);
	faction_graph.set("Four Sigma", []);
	faction_graph.set("OmniTek Incorporated", []);
	faction_graph.set("Blade Industries", []);
	faction_graph.set("Clarke Incorporated", []);
	faction_graph.set("Bachman & Associates", []);
	faction_graph.set("Slum Snakes", []);
	faction_graph.set("Fulcrum Secret Technologies", []);
	faction_graph.set("Silhouette", []);
	faction_graph.set("Tetrads", []);
	faction_graph.set("The Dark Army", []);
	faction_graph.set("Speakers for the Dead", []);
	faction_graph.set("The Covenant", []);
	faction_graph.set("The Syndicate", []);
	faction_graph.set("Illuminati", []);
	faction_graph.set("Daedalus", []);


    const defaultauglist = [
        ["Sector-12", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "CashRoot Starter Kit",
            "price": 125000000,
            "prereq": [],
            "repreq": 12500
        }]],
        ["Chongqing", [{
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "DataJack",
            "price": 450000000,
            "prereq": [],
            "repreq": 112500
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neuregen Gene Modification",
            "price": 375000000,
            "prereq": [],
            "repreq": 37500
        }]],
        ["New Tokyo", [{
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "DataJack",
            "price": 450000000,
            "prereq": [],
            "repreq": 112500
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "NutriGen Implant",
            "price": 2500000,
            "prereq": [],
            "repreq": 6250
        }]],
        ["Ishima", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "INFRARET Enhancement",
            "price": 30000000,
            "prereq": [],
            "repreq": 7500
        }]],
        ["Aevum", [{
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Synaptic Enhancement Implant",
            "price": 7500000,
            "prereq": [],
            "repreq": 2000
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer I",
            "price": 4000000,
            "prereq": [],
            "repreq": 1000
        }, {
            "name": "PCMatrix",
            "price": 2000000000,
            "prereq": [],
            "repreq": 100000
        }]],
        ["Volhaven", [{
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "DermaForce Particle Barrier",
            "price": 50000000,
            "prereq": [],
            "repreq": 15000
        }]],
        ["NiteSec", [{
            "name": "BitWire",
            "price": 10000000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "Artificial Synaptic Potentiation",
            "price": 80000000,
            "prereq": [],
            "repreq": 6250
        }, {
            "name": "Neural-Retention Enhancement",
            "price": 250000000,
            "prereq": [],
            "repreq": 20000
        }, {
            "name": "DataJack",
            "price": 450000000,
            "prereq": [],
            "repreq": 112500
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Cranial Signal Processors - Gen II",
            "price": 125000000,
            "prereq": ["Cranial Signal Processors - Gen I"],
            "repreq": 18750
        }, {
            "name": "Cranial Signal Processors - Gen III",
            "price": 550000000,
            "prereq": ["Cranial Signal Processors - Gen II"],
            "repreq": 50000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer II",
            "price": 45000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "CRTX42-AA Gene Modification",
            "price": 225000000,
            "prereq": [],
            "repreq": 45000
        }]],
        ["CyberSec", [{
            "name": "BitWire",
            "price": 10000000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "Synaptic Enhancement Implant",
            "price": 7500000,
            "prereq": [],
            "repreq": 2000
        }, {
            "name": "Cranial Signal Processors - Gen I",
            "price": 70000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "Cranial Signal Processors - Gen II",
            "price": 125000000,
            "prereq": ["Cranial Signal Processors - Gen I"],
            "repreq": 18750
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer I",
            "price": 4000000,
            "prereq": [],
            "repreq": 1000
        }]],
        ["Tian Di Hui", [{
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "ADR-V1 Pheromone Gene",
            "price": 17500000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Social Negotiation Assistant (S.N.A)",
            "price": 30000000,
            "prereq": [],
            "repreq": 6250
        }, {
            "name": "Neuroreceptor Management Implant",
            "price": 550000000,
            "prereq": [],
            "repreq": 75000
        }]],
        ["BitRunners", [{
            "name": "Artificial Bio-neural Network Implant",
            "price": 3000000000,
            "prereq": [],
            "repreq": 275000
        }, {
            "name": "Enhanced Myelin Sheathing",
            "price": 1375000000,
            "prereq": [],
            "repreq": 100000
        }, {
            "name": "DataJack",
            "price": 450000000,
            "prereq": [],
            "repreq": 112500
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Neural Accelerator",
            "price": 1750000000,
            "prereq": [],
            "repreq": 200000
        }, {
            "name": "Cranial Signal Processors - Gen III",
            "price": 550000000,
            "prereq": ["Cranial Signal Processors - Gen II"],
            "repreq": 50000
        }, {
            "name": "Cranial Signal Processors - Gen IV",
            "price": 1100000000,
            "prereq": ["Cranial Signal Processors - Gen III"],
            "repreq": 125000
        }, {
            "name": "Cranial Signal Processors - Gen V",
            "price": 2250000000,
            "prereq": ["Cranial Signal Processors - Gen IV"],
            "repreq": 250000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer II",
            "price": 45000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "BitRunners Neurolink",
            "price": 4375000000,
            "prereq": [],
            "repreq": 875000
        }]],
        ["ECorp", [{
            "name": "Graphene Bionic Spine Upgrade",
            "price": 6000000000,
            "prereq": ["Bionic Spine"],
            "repreq": 1625000
        }, {
            "name": "Graphene Bionic Legs Upgrade",
            "price": 4500000000,
            "prereq": ["Bionic Legs"],
            "repreq": 750000
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "PC Direct-Neural Interface",
            "price": 3750000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "PC Direct-Neural Interface Optimization Submodule",
            "price": 4500000000,
            "prereq": ["PC Direct-Neural Interface"],
            "repreq": 500000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "ECorp HVMind Implant",
            "price": 5500000000,
            "prereq": [],
            "repreq": 1500000
        }]],
        ["The Black Hand", [{
            "name": "Artificial Synaptic Potentiation",
            "price": 80000000,
            "prereq": [],
            "repreq": 6250
        }, {
            "name": "Enhanced Myelin Sheathing",
            "price": 1375000000,
            "prereq": [],
            "repreq": 100000
        }, {
            "name": "DataJack",
            "price": 450000000,
            "prereq": [],
            "repreq": 112500
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Cranial Signal Processors - Gen III",
            "price": 550000000,
            "prereq": ["Cranial Signal Processors - Gen II"],
            "repreq": 50000
        }, {
            "name": "Cranial Signal Processors - Gen IV",
            "price": 1100000000,
            "prereq": ["Cranial Signal Processors - Gen III"],
            "repreq": 125000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "The Black Hand",
            "price": 550000000,
            "prereq": [],
            "repreq": 100000
        }]],
        ["KuaiGong International", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "Bionic Spine",
            "price": 125000000,
            "prereq": [],
            "repreq": 45000
        }, {
            "name": "Bionic Legs",
            "price": 375000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "FocusWire",
            "price": 900000000,
            "prereq": [],
            "repreq": 75000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "HyperSight Corneal Implant",
            "price": 2750000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Photosynthetic Cells",
            "price": 2750000000,
            "prereq": [],
            "repreq": 562500
        }]],
        ["MegaCorp", [{
            "name": "Graphene Bionic Legs Upgrade",
            "price": 4500000000,
            "prereq": ["Bionic Legs"],
            "repreq": 750000
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "ADR-V1 Pheromone Gene",
            "price": 17500000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "CordiARC Fusion Reactor",
            "price": 5000000000,
            "prereq": [],
            "repreq": 1125000
        }]],
        ["NWO", [{
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Enhanced Social Interaction Implant",
            "price": 1375000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "ADR-V1 Pheromone Gene",
            "price": 17500000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer III",
            "price": 130000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "Power Recirculation Core",
            "price": 180000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "Xanipher",
            "price": 4250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Hydroflame Left Arm",
            "price": 2500000000000,
            "prereq": [],
            "repreq": 1250000
        }]],
        ["Four Sigma", [{
            "name": "Enhanced Social Interaction Implant",
            "price": 1375000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "FocusWire",
            "price": 900000000,
            "prereq": [],
            "repreq": 75000
        }, {
            "name": "PC Direct-Neural Interface",
            "price": 3750000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "ADR-V1 Pheromone Gene",
            "price": 17500000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "ADR-V2 Pheromone Gene",
            "price": 550000000,
            "prereq": [],
            "repreq": 62500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Neurotrainer III",
            "price": 130000000,
            "prereq": [],
            "repreq": 25000
        }]],
        ["OmniTek Incorporated", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "Bionic Spine",
            "price": 125000000,
            "prereq": [],
            "repreq": 45000
        }, {
            "name": "Bionic Legs",
            "price": 375000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Enhanced Social Interaction Implant",
            "price": 1375000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "PC Direct-Neural Interface",
            "price": 3750000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "OmniTek InfoLoad",
            "price": 2875000000,
            "prereq": [],
            "repreq": 625000
        }]],
        ["Blade Industries", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "Bionic Spine",
            "price": 125000000,
            "prereq": [],
            "repreq": 45000
        }, {
            "name": "Bionic Legs",
            "price": 375000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "PC Direct-Neural Interface",
            "price": 3750000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "PC Direct-Neural Interface Optimization Submodule",
            "price": 4500000000,
            "prereq": ["PC Direct-Neural Interface"],
            "repreq": 500000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "HyperSight Corneal Implant",
            "price": 2750000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Neotra",
            "price": 2875000000,
            "prereq": [],
            "repreq": 562500
        }]],
        ["Clarke Incorporated", [{
            "name": "Enhanced Social Interaction Implant",
            "price": 1375000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Neuronal Densification",
            "price": 1375000000,
            "prereq": [],
            "repreq": 187500
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "FocusWire",
            "price": 900000000,
            "prereq": [],
            "repreq": 75000
        }, {
            "name": "ADR-V2 Pheromone Gene",
            "price": 550000000,
            "prereq": [],
            "repreq": 62500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "nextSENS Gene Modification",
            "price": 1925000000,
            "prereq": [],
            "repreq": 437500
        }]],
        ["Bachman & Associates", [{
            "name": "Enhanced Social Interaction Implant",
            "price": 1375000000,
            "prereq": [],
            "repreq": 375000
        }, {
            "name": "Neuralstimulator",
            "price": 3000000000,
            "prereq": [],
            "repreq": 50000
        }, {
            "name": "Nuoptimal Nootropic Injector Implant",
            "price": 20000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "FocusWire",
            "price": 900000000,
            "prereq": [],
            "repreq": 75000
        }, {
            "name": "ADR-V2 Pheromone Gene",
            "price": 550000000,
            "prereq": [],
            "repreq": 62500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "SmartJaw",
            "price": 2750000000,
            "prereq": [],
            "repreq": 375000
        }]],
        ["Slum Snakes", [{
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "LuminCloaking-V1 Skin Implant",
            "price": 5000000,
            "prereq": [],
            "repreq": 1500
        }, {
            "name": "LuminCloaking-V2 Skin Implant",
            "price": 30000000,
            "prereq": ["LuminCloaking-V1 Skin Implant"],
            "repreq": 5000
        }, {
            "name": "SmartSonar Implant",
            "price": 75000000,
            "prereq": [],
            "repreq": 22500
        }]],
        ["Fulcrum Secret Technologies", [{
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "NEMEAN Subdermal Weave",
            "price": 3250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Graphene Bone Lacings",
            "price": 4250000000,
            "prereq": [],
            "repreq": 1125000
        }, {
            "name": "Graphene Bionic Spine Upgrade",
            "price": 6000000000,
            "prereq": ["Bionic Spine"],
            "repreq": 1625000
        }, {
            "name": "Graphene Bionic Legs Upgrade",
            "price": 4500000000,
            "prereq": ["Bionic Legs"],
            "repreq": 750000
        }, {
            "name": "Artificial Bio-neural Network Implant",
            "price": 3000000000,
            "prereq": [],
            "repreq": 275000
        }, {
            "name": "Enhanced Myelin Sheathing",
            "price": 1375000000,
            "prereq": [],
            "repreq": 100000
        }, {
            "name": "Embedded Netburner Module",
            "price": 250000000,
            "prereq": [],
            "repreq": 15000
        }, {
            "name": "Embedded Netburner Module Core Implant",
            "price": 2500000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 175000
        }, {
            "name": "Embedded Netburner Module Core V2 Upgrade",
            "price": 4500000000,
            "prereq": ["Embedded Netburner Module Core Implant"],
            "repreq": 1000000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "PC Direct-Neural Interface Optimization Submodule",
            "price": 4500000000,
            "prereq": ["PC Direct-Neural Interface"],
            "repreq": 500000
        }, {
            "name": "PC Direct-Neural Interface NeuroNet Injector",
            "price": 7500000000,
            "prereq": ["PC Direct-Neural Interface"],
            "repreq": 1500000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }]],
        ["Silhouette", [{
            "name": "Speech Processor Implant",
            "price": 50000000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "TITN-41 Gene-Modification Injection",
            "price": 190000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "ADR-V2 Pheromone Gene",
            "price": 550000000,
            "prereq": [],
            "repreq": 62500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }]],
        ["Tetrads", [{
            "name": "HemoRecirculator",
            "price": 45000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "LuminCloaking-V1 Skin Implant",
            "price": 5000000,
            "prereq": [],
            "repreq": 1500
        }, {
            "name": "LuminCloaking-V2 Skin Implant",
            "price": 30000000,
            "prereq": ["LuminCloaking-V1 Skin Implant"],
            "repreq": 5000
        }, {
            "name": "Power Recirculation Core",
            "price": 180000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "Bionic Arms",
            "price": 275000000,
            "prereq": [],
            "repreq": 62500
        }]],
        ["The Dark Army", [{
            "name": "HemoRecirculator",
            "price": 45000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "The Shadow's Simulacrum",
            "price": 400000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Power Recirculation Core",
            "price": 180000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "Graphene Bionic Arms Upgrade",
            "price": 3750000000,
            "prereq": ["Bionic Arms"],
            "repreq": 500000
        }]],
        ["Speakers for the Dead", [{
            "name": "Unstable Circadian Modulator",
            "price": 5000000000,
            "prereq": [],
            "repreq": 362500
        }, {
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Bionic Spine",
            "price": 125000000,
            "prereq": [],
            "repreq": 45000
        }, {
            "name": "Bionic Legs",
            "price": 375000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "Speech Enhancement",
            "price": 12500000,
            "prereq": [],
            "repreq": 2500
        }, {
            "name": "The Shadow's Simulacrum",
            "price": 400000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Graphene BrachiBlades Upgrade",
            "price": 2500000000,
            "prereq": ["BrachiBlades"],
            "repreq": 225000
        }]],
        ["The Covenant", [{
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "NEMEAN Subdermal Weave",
            "price": 3250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Graphene Bone Lacings",
            "price": 4250000000,
            "prereq": [],
            "repreq": 1125000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "SPTN-97 Gene Modification",
            "price": 4875000000,
            "prereq": [],
            "repreq": 1250000
        }]],
        ["The Syndicate", [{
            "name": "HemoRecirculator",
            "price": 45000000,
            "prereq": [],
            "repreq": 10000
        }, {
            "name": "Augmented Targeting I",
            "price": 15000000,
            "prereq": [],
            "repreq": 5000
        }, {
            "name": "Augmented Targeting II",
            "price": 42500000,
            "prereq": ["Augmented Targeting I"],
            "repreq": 8750
        }, {
            "name": "Augmented Targeting III",
            "price": 115000000,
            "prereq": ["Augmented Targeting II"],
            "repreq": 27500
        }, {
            "name": "Combat Rib I",
            "price": 23750000,
            "prereq": [],
            "repreq": 7500
        }, {
            "name": "Combat Rib II",
            "price": 65000000,
            "prereq": ["Combat Rib I"],
            "repreq": 18750
        }, {
            "name": "Combat Rib III",
            "price": 120000000,
            "prereq": ["Combat Rib II"],
            "repreq": 35000
        }, {
            "name": "Nanofiber Weave",
            "price": 125000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "NEMEAN Subdermal Weave",
            "price": 3250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Wired Reflexes",
            "price": 2500000,
            "prereq": [],
            "repreq": 1250
        }, {
            "name": "Bionic Spine",
            "price": 125000000,
            "prereq": [],
            "repreq": 45000
        }, {
            "name": "Bionic Legs",
            "price": 375000000,
            "prereq": [],
            "repreq": 150000
        }, {
            "name": "ADR-V1 Pheromone Gene",
            "price": 17500000,
            "prereq": [],
            "repreq": 3750
        }, {
            "name": "The Shadow's Simulacrum",
            "price": 400000000,
            "prereq": [],
            "repreq": 37500
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "Power Recirculation Core",
            "price": 180000000,
            "prereq": [],
            "repreq": 25000
        }, {
            "name": "BrachiBlades",
            "price": 90000000,
            "prereq": [],
            "repreq": 12500
        }]],
        ["Illuminati", [{
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "NEMEAN Subdermal Weave",
            "price": 3250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "QLink",
            "price": 25000000000000,
            "prereq": [],
            "repreq": 1875000
        }]],
        ["Daedalus", [{
            "name": "Synthetic Heart",
            "price": 2875000000,
            "prereq": [],
            "repreq": 750000
        }, {
            "name": "Synfibril Muscle",
            "price": 1125000000,
            "prereq": [],
            "repreq": 437500
        }, {
            "name": "NEMEAN Subdermal Weave",
            "price": 3250000000,
            "prereq": [],
            "repreq": 875000
        }, {
            "name": "Embedded Netburner Module Core V3 Upgrade",
            "price": 7500000000,
            "prereq": ["Embedded Netburner Module Core V2 Upgrade"],
            "repreq": 1750000
        }, {
            "name": "Embedded Netburner Module Analyze Engine",
            "price": 6000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 625000
        }, {
            "name": "Embedded Netburner Module Direct Memory Access Upgrade",
            "price": 7000000000,
            "prereq": ["Embedded Netburner Module"],
            "repreq": 1000000
        }, {
            "name": "NeuroFlux Governor",
            "price": 2139439.816550418,
            "prereq": [],
            "repreq": 1426.2932110336117
        }, {
            "name": "The Red Pill",
            "price": 0,
            "prereq": [],
            "repreq": 2500000
        }]]
    ];

	const augmentation_graph = new Map();

	for (const [faction, blockers] of faction_graph) {
		for (let aug of ns.getAugmentationsFromFaction(faction)) {
			augmentation_graph.set(faction, {
                name: aug,
				price:  ns.getAugmentationPrice(aug),
				prereq: ns.getAugmentationPrereq(aug),
				repreq: ns.getAugmentationRepReq(aug),
			});

            }
        }
    
    return { ns, player, augmentation_graph };
    }

    
/**
 * 
 * Gets a list of augmentations that match a stat
 * 
 * 
 * @param {PlayerObject} player 
 * @param {string} priority_stat - the name of a stat, e.g. hacking_mult
 * @returns {Map<Faction.name,Faction.unowned_augs>} desired augs by name
 * 
 */
export const desired_augmentations = (player, priority_stat) => {
    const data = loadAugmentationData(ns, player);
    let desired_augs = new Map();

    let augmentation_graph = data.augmentation_graph;
    for (let faction_name of augmentation_graph.keys()) {
        let faction = factionFactory(faction_name);
        for (let aug_name of faction.unowned_augs.keys()) {
            let aug_data = faction.unowned_augs.get(aug_name);
            // {
            //     "hacking_mult": 1.01,
            //     "hacking_chance_mult": 1.01,
            //     "hacking_speed_mult": 1.01,
            //     "hacking_money_mult": 1.01,
            //     "hacking_grow_mult": 1.01,
            // }
            if (aug_data.stats.hasOwnProperty(priority_stat)) {
                desired_augs.set(faction.name, faction.unowned_augs.get(aug_name));
            }

        }

    }

    if (desired_augs.size > 0) {
    } else {
        globalThis.ns.tprint("Couldn't find any augmentations with ", priority_stat);
    }
    return desired_augs;
};

/**
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 * @param {Faction} faction 
 * 
 * @returns {string|boolean} the best augment to buy
 */
// export const can_buy_best_augmentation = (ns, player, faction) => {
//     const priority_stat = "hacking_mult";
//     let desired = desired_augmentations(player, priority_stat);
//     let most_desired_from_faction = [];
//     if (desired.has(faction.name)) { // if our faction has a desired augmentation
//         let faction_unowned_augs = desired.get(faction.name); // a list of unowned augs at this faction
//         for (let {aug, info} of faction_unowned_augs.entries()) {
//             if (info.stats.hasOwnProperty(priority_stat)) {
//                 most_desired_from_faction.push(faction_unowned_augs.get(aug));
//             }
//         }
//     }

//     let best_aug = most_desired_from_faction.sort((a,b) => b.price - a.price);
//     if (best_aug.length > 0) {
//         if (faction.rep > best_aug[0].repreq && player.money > best_aug[0].price) {
//             return best_aug[0].name;
//         }
//     }
//     return false;
// };


/**
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 * @param {Faction} faction 
 * 
 * @returns {string} the best augment to buy
 */
export const find_best_aug = (ns, player, faction) => {
    const priority_stat = "hacking_mult";
    let desired = desired_augmentations(player, priority_stat);
    let most_desired_from_faction = [];
    // ns.tprint(...desired.entries());
    // ns.tprint(desired.has(faction.name));
    if (desired.has(faction.name)) { // if our faction has a desired augmentation
        // let faction_unowned_augs = desired.get(faction.name); // a list of unowned augs at this faction
        for (let aug of desired.values()) {
            // ns.tprint(aug);
            if (aug.stats.hasOwnProperty(priority_stat)) {
                if (faction.aug_list.includes(aug.name)) {
                    most_desired_from_faction.push(aug);
                }
                
            }
        }
    }

    let best_aug = most_desired_from_faction.sort((a, b) => b.price - a.price);
    if (best_aug.length > 0) {
        return best_aug[0];
    }
    return ""
};


/**
 * 
 * @param {ns} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const prioritize_augmentations = (ns, player) => {
    const pq = new PriorityQueue();

    let augmentation_graph = new Map();

    for (let faction_name of player.faction.membership) {
        let faction = factionFactory(faction_name);
        augmentation_graph = new Map([...faction.unowned_augs,...augmentation_graph]); // merge all factions' unowned
    }

    for (const [name, info] of augmentation_graph) {
        // now we have to reduce the value of an augmentation to a 0-20 number...
        // that determines in which order we want to pursue the augmentation...
        // probably should do it logarithmically...
        // probably add in faction favor and current cash per second as modifiers to these numbers
        let priority = (Math.log(info.price) / Math.log(10)) + Math.log(info.repreq) / Math.log(4);
        priority = Math.min(Math.ceil(priority), 20);

        // this feels like a good formula, since we can do some math on the pq. for instance,
        // it would make sense to consider [all] a factions' augmentations at the priority
        // value of its [most expensive] aug, since getting there will get you all the lower ranked augs
        pq.add(name, priority);
    }
    return pq;
};