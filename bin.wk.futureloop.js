/**
 * @typedef {import(".").NS} ns
 * 
 * @argument {string} target
 * @argument {number} time nextlaunchdate in millis
 *
 * @export
 * @param {ns} ns
 */

 const hackTime_modifier = 4;

 export async function main(ns){
    let args = ns.args;
    let target = args[0];                                           // iter1        // iter2
    let nextlaunchdate = args[1];                                   // 852900       // 
    let hackTime = ns.getHackTime(target);                          // 1000         // it works
    let runtime =  hackTime * hackTime_modifier;                    // 3200         // 
    let looptime = Math.max(hackTime * 4.2, 100);                   // 4200         // 
    
    
    while (true) {                                                  // 852900       // 
        await control(ns);
        let curtime = new Date().valueOf();                         // 848700       // 
        let sleeptime = nextlaunchdate - curtime - runtime;         // 1000         // 
        await ns.sleep(sleeptime);                                  // 849700       // 
        await ns.weaken(target);                                    // 852900       // 
        ns.print("INFO     Weak finished against", target, " at ", new Date().getSeconds(), ".",new Date().getMilliseconds());
        nextlaunchdate += looptime;                                 // 857100       // 
    }                                                               
}
 // all we have to do is stagger launch dates invisibly in the backend. don't send "852900" to all processes, send 852980, 852990, etc.


async function control(ns) {
    let cc = ns.peek(1);
    if (cc !== "NULL PORT DATA") {
        cc = JSON.parse(cc);
        if (cc.request == "SIGHUP") {
            ns.exit();
        }
    }
}