/** @param {import(".").NS } ns */

export async function main(ns) {
    let targ = ns.args[0];
    try {
        ns.brutessh(targ);
        ns.ftpcrack(targ);
        ns.relaysmtp(targ);
        ns.httpworm(targ);
        ns.sqlinject(targ);
    } catch (e) {ns.print(e); }
    try {
        ns.nuke(targ);
    } catch (e) {ns.print(e); }
    
}