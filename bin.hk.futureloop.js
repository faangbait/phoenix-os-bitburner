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
     let target = args[0];                                           // iter1        // iter2
     let nextlaunchdate = args[1];                                   // 852900       // 
     let hackTime = ns.getHackTime(target);                          // 1000         // it works
     let runtime =  hackTime * hackTime_modifier;                    // 3200         // 
     let looptime = Math.max(hackTime * 4.2, 100);                   // 4200         // 
     ns.tprint("Hack finished against ", target, " at ", new Date().getSeconds(), ".",new Date().getMilliseconds());
                                                                          //              // 
     while (true) {                                                  // 852900       // 
         let curtime = new Date().valueOf();                         // 848700       // 
         let sleeptime = nextlaunchdate - curtime - runtime;         // 1000         // 
         await ns.sleep(sleeptime);                                  // 849700       // 
         await ns.hack(target);                                      // 852900       // 
         nextlaunchdate += looptime;                                 // 857100       // 
     }                                                               
 }
 // all we have to do is stagger launch dates invisibly in the backend. don't send "852900" to all processes, send 852980, 852990, etc.
