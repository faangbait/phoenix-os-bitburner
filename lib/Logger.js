/**
 * Note: File is meant to be zero ram and imported
 */
export class TermLogger {
    constructor(ns) {
        this.ns = ns;
    }
    info(msg, ...args) {
        this.ns.tprintf(`${TermLogger.INFO_LITERAL} ${msg}`, ...args);
    }
    warn(msg, ...args) {
        this.ns.tprintf(`${TermLogger.WARN_LITERAL} ${msg}`, ...args);
    }
    err(msg, ...args) {
        this.ns.tprintf(`${TermLogger.ERR_LITERAL} ${msg}`, ...args);
    }
    log(msg, ...args) {
        this.ns.tprintf(`${TermLogger.TRACE_LITERAL} ${msg}`, ...args);
    }
}
TermLogger.INFO_LITERAL = "INFO   >";
TermLogger.WARN_LITERAL = "WARN   >";
TermLogger.ERR_LITERAL = "ERROR  >";
TermLogger.TRACE_LITERAL = "TRACE  >";
