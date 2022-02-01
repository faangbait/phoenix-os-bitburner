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
import { PriorityQueue } from "./lib.structures.so";

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
        this.priorityQueue = new PriorityQueue();

        this.files = [{
            path: "bin.universal.loop.js",
            ram: 2.4,
            ratio: 1
        }];
        
        this.memory_req = this.files.reduce((a,b) => a+ (b.ram * b.ratio), 0);
        this.stagger = 1;

        // if true, very powerful servers (hundreds of thousands of threads) will attack multiple targets no matter what the strategy is
        // currently: always enabled
        // this.optimize_thread_splitting = true; 
    }

    /**
     * Disqualifies some (legal) servers from being considered as attackers.
     * Default: Disqualify no (legal) attackers. Legal attackers are defined in __qualify, part of the core package and not able to be overriden.
     * 
     * @param {ServerObject} s The server to consider. 
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

        try {
            if (a.id != "home") {
                globalThis.ns.exec("sbin.scp.js", "home", 1, ...args);
            }
            
        } catch (e) {
            ns.tprint("error bootstrapping");
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
        // return (t.id !== "n00dles");
    }


    /**
     * A priority queue. 
     * 
     * Acceptable priorities range from 20 (lowest priority) to 0 (highest priority)
     * A target that matches no condition defined below will receive a priority of 15.
     * 
     * Targets that match the specified filters will be assigned a priority,
     * the numerical value on the left. A target that would match both "10" and
     * "20" at the same time will recieve a priority of 10.
     * 
     * Lowest value gets attacked first.
     * Priority values can be duplicated.
     * 
     * There's no reason you couldn't write some equations to set target priority, since
     * it's integer based...
     * 
     * On every loop, all legal targets' priorities reset to 0. If no targets match
     * any of the conditions defined below, all legal targets will become equally
     * likely to receive an attack.
     *
     * @return {Map} 
     * @memberof Default
     */
    filter_targets() {
        let priorities = new Map();

        priorities.set(0, (t => (t.money.available / t.money.max) == 1));
        priorities.set(5, (t => t.security.level == t.security.min));
        priorities.set(10, (t => t.level < 100));
        priorities.set(14, (t => t.hackTime < 60));
        // default: 15, so the filter below probably won't ever get attacked.
        // if you need to definitively prevent attacks, use disqualify_target()
        priorities.set(17, (t => t.security.level > 80));

        return priorities;
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
        var remaining_ram = a.ram.free;

        let target = this.priorityQueue.poll();

        while (target) {
            while (remaining_ram >= this.memory_req) {
                let suggested_bundle = [];
                let bundle_ram = 0;
                for (let {
                        path,
                        ram,
                        ratio
                    } of this.files) {
                    let threads = a.threadCount(this.memory_req / ratio);
                    threads = Math.min(threads, target.hackMaxThreads); // don't overhack
                    threads = Math.max(1, threads); // minimum 1 thread
                    threads = Math.floor(threads); // round to floor
                    suggested_bundle.push({
                        file: path,
                        attacker: a.id,
                        threads: threads,
                        args: [target.id]
                    });
                    bundle_ram += threads * ram;
                }
                // ns.tprint("Suggested bundle: ", suggested_bundle);
                if (suggested_bundle.length == this.files.length &&
                    bundle_ram <= remaining_ram &&
                    suggested_bundle.every(b => b.threads >=1) &&
                    suggested_bundle.every(b => typeof b.attacker === "string")) {
                    bundles.push(...suggested_bundle.map(b => JSON.stringify(b)));
                    remaining_ram -= bundle_ram;
                } else {
                    ns.tprint("Couldn't push bundle: ",
                    (suggested_bundle.length == this.files.length)," ",
                    (bundle_ram <= remaining_ram), " ",
                    suggested_bundle.every(b => b.threads >=1)," ",
                    suggested_bundle.every(b => typeof b.attacker === "string")," ",
                    );
                    remaining_ram = 0;
                }
                break;
            }
            target = this.priorityQueue.poll();
        }

        // ns.tprint("Bundles: ", bundles);
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
            // ns.tprint(e);
        for (let attack of e) {
            let attack_array = JSON.parse(attack);
            ns.tprint(attack_array);
            pids.push(globalThis.ns.exec(attack_array.file, attack_array.attacker, attack_array.threads, ...attack_array.args));
        }
        return pids;
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
        var debug_mode = globalThis.ns.read("var.debug.txt");
        
        if (debug_mode) {
            globalThis.ns.print("");
            globalThis.ns.print(debug_mode);
            globalThis.ns.print("");
            debug_mode = true;
        }

        if (!debug_mode) {
            let pt = new PrettyTable();

            let headers = ["UNQUAL", "AVAIL", "FULL"];

            let rows = [];
            let server_copy = Array.from([...servers.filter(s => s.admin && s.ram.max > 0)]);

            for (let i = 0; i < Math.min(25, server_copy.length); i++) {
                rows.push([
                    server_copy.filter(s => s.ram.max < this.memory_req).map(s => s.id)[i] || "",
                    server_copy.filter(s => s.ram.free >= this.memory_req ).map(s => s.id)[i] || "",
                    server_copy.filter(s => s.ram.free < this.memory_req).map(s => s.id)[i] || ""
                ]);
            }
            pt.create(headers, rows);
            globalThis.ns.clearLog();
            globalThis.ns.print("RAM UTILIZATION");
            globalThis.ns.print(pt.print());
        } 

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
        let qualified_array = servers.filter(s => 
            (s.threadCount(this.memory_req) > 0) &&
            (s.admin) &&
            (!this.disqualify_attacker(s))
            );
            // ns.tprint(qualified_array.map(s=>s.id))
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
        let bootstrapped = attackers.sort((a,b) => b.ram.max - a.ram.max);
        // ns.tprint(bootstrapped.map(s=>s.id))
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
        let target_array = servers.filter(s => 
            (s.money.max > 0) &&
            (s.level < globalThis.ns.getPlayer().hacking) &&
            (s.admin) &&
            (s.id != "home") &&
            (!this.disqualify_target(s))
            );
            target_array.forEach(t => this.priorityQueue.add(t, 15));
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
        let filter_map = this.filter_targets();

        for (const [priority, filter] of filter_map) {
            let priority_targets = targets.filter(filter);
            for (let target of priority_targets) {
                if (this.priorityQueue.findByValue(target) > priority) {
                    this.priorityQueue.changePriority(target, priority);
                }
                
            }
        }
        // ns.tprint(targets.map(t=>t.id));
        return targets;
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
        let packaged = bootstrapped.map(a => this.prepare_package(a, targets));
        // ns.tprint(packaged);
        return packaged;
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
        return this.iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids);
    }
}