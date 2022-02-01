/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 * @argument {number} time in millis
 *
 * @export
 * @param {ns} ns
 */

const hackTime_modifier = 1;

export async function main(ns){
    let args = ns.args;
    let target = args[0];
    let nextlaunchdate = args[1];
    let hackTime = ns.getHackTime(target);
    let runtime =  hackTime * hackTime_modifier;
    let looptime = Math.max(hackTime * 4.2, 100);
    
    while (true) {
        await control(ns); 
        let curtime = new Date().valueOf();
        let sleeptime = nextlaunchdate - curtime - runtime;
        await ns.sleep(sleeptime);
        await ns.hack(target);
        ns.print("NOERROR  Hack finished against", target, " at ", new Date().getSeconds(), ".",new Date().getMilliseconds());
        nextlaunchdate += looptime;
    }                                                               
}

async function control(ns) {
    let cc = ns.peek(1);
    if (cc !== "NULL PORT DATA") {
        cc = JSON.parse(cc);
        if (cc.request == "SIGHUP") {
            ns.exit();
        }
    }
}