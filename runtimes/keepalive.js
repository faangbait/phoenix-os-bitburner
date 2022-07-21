import { CORE_RUNTIMES } from "lib/Variables";
import { PORTS } from "lib/Database";
export const main = async (ns) => {
    var count = 0;
    while (true) {
        await ns.sleep(60000);
        if (count > 120) {
            ns.tprint("scheduled reboot");
            ns.ps("home").filter(process => process.filename != CORE_RUNTIMES.KEEPALIVE).forEach(process => ns.kill(process.pid));
            ns.run(CORE_RUNTIMES.PHOENIX);
            count = 0;
        }
        if (ns.ps("home").filter(process => process.filename == CORE_RUNTIMES.PHOENIX).length != 1) {
            ns.run(CORE_RUNTIMES.PHOENIX);
            ns.print("phoenix not found");
        }
        try {
            let heartbeat = ns.peek(PORTS.heartbeat);
            let curtime = new Date().valueOf();
            ns.print((curtime - heartbeat) / 1000, " seconds since last heartbeat");
            if ((curtime - heartbeat) / 1000 > 300) {
                throw "Heartbeat is old.";
            }
        }
        catch (e) {
            ns.tprint("error ", e);
            ns.ps("home").filter(process => process.filename != CORE_RUNTIMES.KEEPALIVE).forEach(process => ns.kill(process.pid));
            ns.run(CORE_RUNTIMES.PHOENIX);
        }
        count++;
    }
};
