import DaemonDefault from "logic/DaemonDefault";
/**
 * Runs when we are established and at Daedalus augs req
 */
export default class DaemonJoinDaedalus extends DaemonDefault {
    constructor(ns, servers, player) {
        super(ns, servers, player);
        this.module = "DAEMON_JOINDAEDALUS";
    }
}
