/**
 * @typedef {import(".").NS} ns
 *
 */

export async function main(ns) {
    var count = 0;
    while (true) {

        if (count > 120) {
            ns.tprint("scheduled reboot");
            ns.ps("home").filter(process => process.filename != "sbin.keepalive.js").forEach(process => ns.kill(process.pid));
            ns.run("phoenix.js");
            count = 0;
        }

        if (ns.ps("home").filter(process => process.filename == "phoenix.js").length != 1) {
            ns.run("phoenix.js");
            ns.print("phoenix not found");
        }

        try {
            let heartbeat = ns.peek(20);
            let curtime = new Date().valueOf();
            ns.print((curtime - heartbeat)/1000, " seconds since last heartbeat");
           
            if ((curtime - heartbeat)/1000 > 300) {
                throw "Heartbeat is old.";
            }
        } catch (e) {
            
            ns.tprint("error ", e);

            ns.ps("home").filter(process => process.filename != "sbin.keepalive.js").forEach(process => ns.kill(process.pid));
            ns.run("phoenix.js");
        }
        await ns.sleep(60000);
        count++;

    }
}