export const reservedHomeRam = 64;
export const loop_time = 3000;

const HackSemaphores = {
};

export const strategy_semaphores = HackSemaphores;

export const faction_blockers = new Map([
    ["Sector-12", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]],
    ["Chongqing", ["Sector-12", "Aevum", "Volhaven"]],
    ["New Tokyo", ["Sector-12", "Aevum", "Volhaven"]],
    ["Ishima", ["Sector-12", "Aevum", "Volhaven"]],
    ["Aevum", ["Chongqing", "New Tokyo", "Ishima", "Volhaven"]],
    ["Volhaven", ["Chongqing", "New Tokyo", "Ishima", "Sector-12", "Aevum"]],
    ["NiteSec", []],
    ["CyberSec", []],
    ["Tian Di Hui", []],
    ["BitRunners", []],
    ["ECorp", []],
    ["The Black Hand", []],
    ["KuaiGong International", []],
    ["MegaCorp", []],
    ["NWO", []],
    ["Four Sigma", []],
    ["OmniTek Incorporated", []],
    ["Blade Industries", []],
    ["Clarke Incorporated", []],
    ["Bachman & Associates", []],
    ["Slum Snakes", []],
    ["Fulcrum Secret Technologies", []],
    ["Silhouette", []],
    ["Tetrads", []],
    ["The Dark Army", []],
    ["Speakers for the Dead", []],
    ["The Covenant", []],
    ["The Syndicate", []],
    ["Illuminati", []],
    ["Daedalus", []]
]);































