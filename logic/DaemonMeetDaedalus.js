import DaemonDefault from "logic/DaemonDefault";
/**
 * Runs when we are very established but under Daedalus augs req
 */
export default class DaemonMeetDaedalus extends DaemonDefault {
    constructor(ns, servers, player) {
        super(ns, servers, player);
        this.module = "DAEMON_MEETDAEDALUS";
    }
}
