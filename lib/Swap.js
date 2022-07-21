import { SYS_SCRIPTS } from "lib/Variables";
import { RESERVED_HOME_RAM } from "modules/servers/ServerEnums";
export const ReservedRam = {
    launch_max_reserve_shares(ns, extra = 0) {
        let home = ns.getServer("home");
        let shares = Math.floor(Math.min(home.maxRam - home.ramUsed, extra + RESERVED_HOME_RAM) / 4);
        if (shares > 0) {
            return ns.exec(SYS_SCRIPTS.SWAP_RAM, "home", shares);
        }
        else {
            return 0;
        }
    },
    async use(ns, script, threads = 1, args = []) {
        ns.exec(script, "home", threads, ...args);
        // let request: HomeExec = {
        //     file: script,
        //     threads: threads,
        //     home_required: true,
        //     args: args
        // }
        // this is crashing 
        // ns.exec(request.file,"home",request.threads,...request.args);
        // await ns.tryWritePort(PORTS.swap, JSON.stringify(request))
        // await ns.asleep(60);
        // let relaunch = 0;
        // while (relaunch === 0) { 
        //     relaunch = ReservedRam.launch_max_reserve_shares(ns);
        //     await ns.asleep(1000) 
        // }
    }
};
