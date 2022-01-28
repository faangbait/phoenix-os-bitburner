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

        await ns.scp([
            "bin.gr.future.js",
            "bin.gr.futureloop.js",
            "bin.gr.loop.js",
            "bin.gr.once.js",
    
            "bin.hk.future.js",
            "bin.hk.futureloop.js",
            "bin.hk.loop.js",
            "bin.hk.once.js",
    
            "bin.wk.future.js",
            "bin.wk.futureloop.js",
            "bin.wk.loop.js",
            "bin.wk.once.js",
    
            "bin.prep.js",
            "bin.share.loop.js",
            "bin.universal.loop.js",
    
        ], "home", targ);
        
    } catch (e) {ns.print(e); }
    
    
}
