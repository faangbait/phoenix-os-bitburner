/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import {
    strategy_semaphores
} from "./var.constants";
import PrettyTable from "./src.prettytable";

export const semaphores = strategy_semaphores;
/**
 * Default strategy algorithm.
 * 
 * NOTE: When overloading, only overload methods ((WITHOUT)) underscores in front of their name.
 * The __methodname designation indicates that it is a core method and shouldn't be touched.
 * 
 * Functions to override also include the @override designation in JSDoc
 * 
 * @export
 * @class Default
 */
export default class Default {
    constructor(ns, player, servers) {
        this.files = [{
            path: "bin.universal.loop.js",
            ram: 2.4
        }];
        
        // by default, we assume files here will all be executed on the target at equal thread counts. you can override this.memory_req.
        this.memory_req = this.files.reduce((a,b) => a+b.ram, 0);
        this.stagger = 1;
        // this.optimize_thread_splitting = true; // if true, very powerful servers (hundreds of thousands of threads) will attack multiple targets no matter what the strategy is
    }

    /**
     * Disqualifies some (legal) servers from being considered as attackers.
     * Default: Disqualify no legal attackers
     * 
     * @param {ServerObject} s Server to consider
     * @return {boolean} true if server disqualified
     * @memberof Default
     * @override
     */
    disqualify_attacker(s) {
        return false;
    }

    /**
     * Bootstraps a single attacker, uploading the required files.
     *
     * @param {ServerObject} a
     * @return {ServerObject} 
     * @memberof Default
     * @override
     */
    bootstrap(a) {
        let args = [a.id];
        args.push(...this.files.map(f => f.path));

        if (globalThis.ns.exec('sbin.scp.js', 'home', 1, ...args)) {
            a.status = semaphores.BOOTSTRAPPED;
        } else {
            globalThis.ns.tprint("Error bootstrapping ", a.id);
        }

        return a;
    }

    /**
     * Disqualifies some (legal) servers from being considered as targets.
     * Default: Disqualify n00dles
     * 
     * @param {ServerObject} t Server to consider
     * @return {boolean} true if server disqualified
     * @memberof Default
     * @override
     */
    disqualify_target(t) {
        return (t.id === "n00dles");
    }

    /**
     * A sorted order of preferred targets.
     *
     * A list of booleans. Return TRUE if a server is preferred.
     * Return an empty list to perform no filtering.
     * 
     * Targets will be checked in order. They will continue to be filtered
     * until a filter would return NO targets; this filter will be ignored
     * and the preceding filter(s) will be the final targeting filter.
     * 
     * @memberof Default
     * @override
     */
    filter_targets() {
        return [
            (t => t.level < 400),
            (t => t.money.max > 100000000),
        ];
    }

    /**
     * Gives the final sieve one last sort.
     * Default: Prefer the lowest level target
     *
     * @param {ServerObject[]} targets
     * @memberof Default
     * @override
     */
    sort_targets(targets) {
        return targets.sort((a, b) => a.level - b.level);
    }

    /**
     * Create a list of attack_package objects that instruct the deployer
     *
     * @param {ServerObject} a a single attacker
     * @param {ServerObject[]} targets a list of targets
     * @memberof Default
     * @override
    */
    prepare_package(a, targets) {
        var bundles = [];
        var ram_used_this_bundle = 0;

        targets.forEach(target => {
            ram_used_this_bundle += Math.floor(a.threadCount(this.memory_req)) * this.memory_req;

            if (a.ram.free >= ram_used_this_bundle )
            for (let { path, ram } of this.files) {
                bundles.push(JSON.stringify({
                    file: path,
                    attacker: a.id,
                    threads: Math.floor(a.threadCount(this.memory_req / ( ram / this.memory_req))),
                    args: [target.id]
                }));

               }
        });
        return bundles;
    }


    /**
     * Executes the bundle and returns its pid
     *
     * @param {object} e a deployment bundle
     * @return {number[]} a list of pids
     * @memberof Default
     * @override
     */
    deploy_package(e) {
        let pids = [];
            
        for (let attack of e) {
            let attack_array = JSON.parse(attack);
            pids.push(globalThis.ns.exec(attack_array.file, attack_array.attacker, attack_array.threads, ...attack_array.args));
           
        }
            
        return pids;
    }

    complete_when(t) { // when to mark a target complete
        return (t.money.available / t.money.max < 0.01);
    }

    /**
     * Catch-all for any additional reporting, debugging, or actions
     *
     * @param {ServerObject[]} servers
     * @param {ServerObject[]} attackers
     * @param {ServerObject[]} bootstrapped
     * @param {ServerObject[]} targets
     * @param {ServerObject[]} filtered
     * @param {string[]} executions
     * @param {number[]} pids
     * @memberof Default
     */
    iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids) {
        if (ns.read("var.debug.txt")) {var debug_mode = true;} else {var debug_mode = false;};

        if (!debug_mode) {
            let pt = new PrettyTable();
            let headers = ["AVAIL", "DISQ", "PROG", "SAT", "COMPL"];

            let rows = [];
            for (let i = 0; i < 12; i++) {
                rows.push([
                servers.filter(s => s.status == semaphores.AVAILABLE).map(s=>s.id)[i] || "",
                servers.filter(s => s.status == semaphores.DISQUALIFIED).map(s=>s.id)[i] || "",
                servers.filter(s => s.status == semaphores.IN_PROGRESS).map(s=>s.id)[i] || "",
                servers.filter(s => s.status == semaphores.SATURATED).map(s=>s.id)[i] || "",
                servers.filter(s => s.status == semaphores.COMPLETED).map(s=>s.id)[i] || "",
            ]);
            }
            
            pt.create(headers, rows);
            globalThis.ns.clearLog();
            globalThis.ns.print(pt.print());
        }


        // servers.filter(s => s.pids.length == 0).forEach(p => p.status = semaphores.AVAILABLE);
        return {servers, attackers, bootstrapped, targets, filtered, executions, pids};
    }
    
    /** 
    * Begin Core Methods - Don't use classes below this line
    */

    /**
     * Returns qualified attackers.
     * 
     * 
     * @param {ServerObject[]} servers
     * @memberof Default
     */
    __qualify(servers) {
        let qualified_array = [];
        for (let s of servers) {
            if ((s.status != semaphores.IN_PROGRESS && s.threadCount(this.memory_req) == 0) || this.disqualify_attacker(s)) {
                s.status = semaphores.DISQUALIFIED;
            }
            if (!s.admin || !s.ram.max) {
                s.status = semaphores.ILLEGAL;
            }
            if (![
                semaphores.DISQUALIFIED,
                semaphores.ILLEGAL,
                semaphores.RESERVED
            ].includes(s.status)) {
                qualified_array.push(s);
            }
        }
        return qualified_array;
    }

    /**
     * Bootstraps attackers, uploading the required files.
     *
     * 
     * @param {ServerObject[]} attackers
     * @return {ServerObject[]} 
     * @memberof Default
     * @override
     */
    __bootstrap(attackers) {
        let bootstrapped = attackers.filter(a => ![
            semaphores.BOOTSTRAPPED,
            semaphores.IN_PROGRESS,
            semaphores.HOLD,
            semaphores.CANCELLED,
            semaphores.DISQUALIFIED,
        ].includes(a.status));
        bootstrapped.sort((a,b) => b.ram.max - a.ram.max);
        return bootstrapped.slice(0, this.stagger).map(a => this.bootstrap(a));
    }

    /**
     * Returns qualified targets.
     * 
     * 
     * @param {ServerObject[]} servers
     * @memberof Default
     */
    __target(servers) {
        let target_array = [];

        for (let t of servers) {
            if (t.money.max > 0 && t.admin && t.id != "home") {
                if (![
                    semaphores.COMPLETED,
                    semaphores.ILLEGAL,
                    semaphores.RESERVED,
                ].includes(t));
                target_array.push(t);
            }
        }

        target_array = target_array.filter(t => !this.disqualify_target(t));

        return target_array;
    }

    /**
     * Sieve targets through an ever-reducing sorting funnel
     * to identify the best target.
     *
     * @param {ServerObject[]} targets
     * @memberof Default
     * @return {ServerObject} a single target
     */
    __filter_targets(targets) {
        let sieve_generator = this.__sieve_targets(targets);
        var sieved_targets = [];

        var sieve;
        do {
            sieve = sieve_generator.next();
            sieved_targets.push(sieve.value);
        } while (!sieve.done);
        return this.sort_targets(sieved_targets.reverse().pop());

    }

    /**
     * Generator to execute the sieve
     *
     * @param {ServerObject[]} targets
     * @return {ServerObject[]} 
     * @memberof Default
     */
    * __sieve_targets(targets) { // do not overload ever
        var selector = this.filter_targets();
        let sieved_targets = targets;
        let guaranteed_target = targets.pop();

        if (targets.length === 0) {
            return [guaranteed_target];
        }
        
        for (let t of selector) {
            sieved_targets = targets;

            targets = targets.filter(t);
            if (targets.length === 0) { return sieved_targets; }

            yield targets;
        }
    }

    /**
     * Prepare for deployment of necessary exec commands to attackers.
     *
     * @param {ServerObject[]} bootstrapped
     * @param {ServerObject[]} targets
     * @return {string[]} JSON-packaged executions
     * @memberof Default
     */
    __package(bootstrapped, targets) {
        bootstrapped.forEach(s => s.status = semaphores.IN_PROGRESS);
        return bootstrapped.map(a => this.prepare_package(a, targets));
    }

    /**
     * Executes the package
     *
     * @param {string[]} executions JSON-packaged executions
     * @return {number[]} pids
     * @memberof Default
     */
    __deploy(executions) {

        return executions.map(e => this.deploy_package(e));
    }

    /**
     * Reporting and reclassifying targets
     *
     * @param {ServerObject[]} servers
     * @param {ServerObject[]} attackers
     * @param {ServerObject[]} bootstrapped
     * @param {ServerObject[]} targets
     * @param {ServerObject[]} filtered
     * @param {string[]} executions
     * @param {number[]} pids
     * @memberof Default
     */
    __iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids) {
        // for (let t of targets) {
        //     if (this.complete_when(t)) {
        //         t.status = semaphores.COMPLETED;
        //     }
        // }
        
        // let completed = servers.filter(server => server.status === semaphores.COMPLETED).map(server => server.hostname);
        // servers.map(server => server.pids).flat().filter(process => completed.includes(process.target) || completed.includes(process.args[0])).forEach(process => globalThis.ns.kill(process.pid));

        // servers.map(server => server.pids)
        // .filter(server => completed.includes(server.hostname))
        // .forEach(process => globalThis.ns.tprint(process));
        
        servers.filter(s => s.threadCount(this.memory_req) > 0).forEach(s => s.status = semaphores.AVAILABLE);
        // bootstrapped.filter(s => s.pids.length == 0).forEach(p => p.status = semaphores.AVAILABLE); // catch failed deployments

        return this.iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids);
    }
}

