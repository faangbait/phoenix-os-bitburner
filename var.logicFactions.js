export class Faction {
    constructor(name) {
        this.name = name;
    }

    get aug_list() {
        return ns.getAugmentationFromFaction(this.name);
    }

}

export const joinFactions = async (ns, player, faction=null) => {

    let faction_graph = new Map();
    
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
    
    if (!faction_graph.has(faction)) {
        for (let [name, blockers] of faction_graph) {
            if (!blockers.length) {
                try {
                    ns.joinFaction(name);
                } catch (e) {}
            } else {
                //logic needed
            }
        }
    } else {
        // faction name was specified
        ns.joinFaction(faction);
    }
    
};

/**
 * 
 * @param {NS} ns 
 * @param {import("./phoenix-doc").PlayerObject} player 
 */
export const selectFocusActivity = async (ns, player) => {
    if (player.faction.membership.length == 0) {
        return player;
    }

    if (player.faction.membership.length == 1) {
        ns.workForFaction(player.faction.membership[0], "Hacking Contracts", false);
    }

    if (ns.getFactionRep("BitRunners") < 250000) {
        ns.workForFaction("BitRunners", "Hacking Contracts", false);
     }
     if (ns.getFactionRep("NiteSec") < 112500) {
        ns.workForFaction("NiteSec", "Hacking Contracts");
     }

     if (ns.getFactionRep("CyberSec") < 18500) {
        ns.workForFaction("CyberSec", "Hacking Contracts", false);
     }
};
