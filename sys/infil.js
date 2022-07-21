import PrettyTable from "lib/PrettyTable";
export const main = async (ns) => {
    let pt = new PrettyTable();
    let columns = ["Location", "Difficulty", "City", "Cost/Xp Mult", "maxClearance", "startingSecurity", "Reward", "Reward/Lvl", "LVLs per Fail"];
    let locations = [
        "Four Sigma",
        "ECorp",
        "Rho Construction",
        "Watchdog Security",
        "AeroCorp",
        "Bachman & Associates",
        "Clarke Incorporated",
        "Fulcrum Technologies",
        "Galactic Cybersystems",
        "NetLink Technologies",
        "Aevum Police Headquarters",
        "KuaiGong International",
        "Solaris Space Systems",
        "Nova Medical",
        "Omega Software",
        "Storm Technologies",
        "DefComm",
        "Global Pharmaceuticals",
        "VitaLife",
        "Alpha Enterprises",
        "Blade Industries",
        "Carmichael Security",
        "DeltaOne",
        "Icarus Microsystems",
        "Joe's Guns",
        "MegaCorp",
        "Universal Energy",
        "CompuTek",
        "Helios Labs",
        "LexoCorp",
        "NWO",
        "OmniTek Incorporated",
        "Omnia Cybersystems",
        "SysCore Securities",
    ];
    locations.sort((a, b) => ns.infiltration.getInfiltration(b).reward.tradeRep / ns.infiltration.getInfiltration(b).location.infiltrationData.maxClearanceLevel - ns.infiltration.getInfiltration(a).reward.tradeRep / ns.infiltration.getInfiltration(a).location.infiltrationData.maxClearanceLevel);
    let rows = locations.map(loc => {
        let infildata = ns.infiltration.getInfiltration(loc);
        return [
            infildata.location.name || "",
            ns.nFormat(infildata.difficulty, '0.0') || "",
            infildata.location.city || "",
            `${infildata.location.costMult}/${infildata.location.expMult}`,
            infildata.location.infiltrationData.maxClearanceLevel || "",
            infildata.location.infiltrationData.startingSecurityLevel || "",
            ns.nFormat(infildata.reward.tradeRep, '0a') || "",
            ns.nFormat(infildata.reward.tradeRep / infildata.location.infiltrationData.maxClearanceLevel, '0.0a'),
            ns.nFormat(infildata.location.infiltrationData.maxClearanceLevel / (ns.getPlayer().max_hp / infildata.location.infiltrationData.startingSecurityLevel), '0.0')
        ];
    });
    rows.sort((a, b) => b[7] - a[7]);
    pt.create(columns, rows);
    ns.tprint(pt.print());
};
