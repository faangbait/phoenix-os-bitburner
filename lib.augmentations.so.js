const augmentation_graph = new Map();


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

    [["Sector-12",{"name":"CashRoot Starter Kit","price":125000000,"prereq":[],"repreq":12500}],["Chongqing",{"name":"Neuregen Gene Modification","price":375000000,"prereq":[],"repreq":37500}],["New Tokyo",{"name":"NutriGen Implant","price":2500000,"prereq":[],"repreq":6250}],["Ishima",{"name":"INFRARET Enhancement","price":30000000,"prereq":[],"repreq":7500}],["Aevum",{"name":"PCMatrix","price":2000000000,"prereq":[],"repreq":100000}],["Volhaven",{"name":"DermaForce Particle Barrier","price":50000000,"prereq":[],"repreq":15000}],["NiteSec",{"name":"CRTX42-AA Gene Modification","price":225000000,"prereq":[],"repreq":45000}],["CyberSec",{"name":"Neurotrainer I","price":4000000,"prereq":[],"repreq":1000}],["Tian Di Hui",{"name":"Neuroreceptor Management Implant","price":550000000,"prereq":[],"repreq":75000}],["BitRunners",{"name":"BitRunners Neurolink","price":4375000000,"prereq":[],"repreq":875000}],["ECorp",{"name":"ECorp HVMind Implant","price":5500000000,"prereq":[],"repreq":1500000}],["The Black Hand",{"name":"The Black Hand","price":550000000,"prereq":[],"repreq":100000}],["KuaiGong International",{"name":"Photosynthetic Cells","price":2750000000,"prereq":[],"repreq":562500}],["MegaCorp",{"name":"CordiARC Fusion Reactor","price":5000000000,"prereq":[],"repreq":1125000}],["NWO",{"name":"Hydroflame Left Arm","price":2500000000000,"prereq":[],"repreq":1250000}],["Four Sigma",{"name":"Neurotrainer III","price":130000000,"prereq":[],"repreq":25000}],["OmniTek Incorporated",{"name":"OmniTek InfoLoad","price":2875000000,"prereq":[],"repreq":625000}],["Blade Industries",{"name":"Neotra","price":2875000000,"prereq":[],"repreq":562500}],["Clarke Incorporated",{"name":"nextSENS Gene Modification","price":1925000000,"prereq":[],"repreq":437500}],["Bachman & Associates",{"name":"SmartJaw","price":2750000000,"prereq":[],"repreq":375000}],["Slum Snakes",{"name":"SmartSonar Implant","price":75000000,"prereq":[],"repreq":22500}],["Fulcrum Secret Technologies",{"name":"NeuroFlux Governor","price":1266720.1199999996,"prereq":[],"repreq":844.4800799999997}],["Silhouette",{"name":"NeuroFlux Governor","price":1266720.1199999996,"prereq":[],"repreq":844.4800799999997}],["Tetrads",{"name":"Bionic Arms","price":275000000,"prereq":[],"repreq":62500}],["The Dark Army",{"name":"Graphene Bionic Arms Upgrade","price":3750000000,"prereq":["Bionic Arms"],"repreq":500000}],["Speakers for the Dead",{"name":"Graphene BrachiBlades Upgrade","price":2500000000,"prereq":["BrachiBlades"],"repreq":225000}],["The Covenant",{"name":"SPTN-97 Gene Modification","price":4875000000,"prereq":[],"repreq":1250000}],["The Syndicate",{"name":"BrachiBlades","price":90000000,"prereq":[],"repreq":12500}],["Illuminati",{"name":"QLink","price":25000000000000,"prereq":[],"repreq":1875000}],["Daedalus",{"name":"The Red Pill","price":0,"prereq":[],"repreq":2500000}]]

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
    ns.tprint(augmentation_graph.entries());
    }

    
    
    

