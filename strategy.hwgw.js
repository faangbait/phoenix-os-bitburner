/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

import Default from "./strategy.base";
import { semaphores } from "./strategy.base";
import PrettyTable from "./src.prettytable";
export default class hwgw extends Default {
    constructor() {
        super();
        this.files = [
            {
                path: "bin.hk.futureloop.js",
                ram: 1.7
            },
            {
                path: "bin.gr.futureloop.js",
                ram: 1.75
            },
            {
                path: "bin.wk.futureloop.js",
                ram: 1.75
            }
        ];
        this.stagger = 1;
        this.memory_req = 1024;
        this.optimize_thread_splitting = false;
    }

    disqualify_attacker(s) {
        return (s.ram.free < 128);
    }

    disqualify_target(t) {
        return (t.money.max > t.money.available || t.security.level > t.security.min || t.id === "n00dles");
    }

    filter_targets() {
        return [
            (t => t.security.level < 100),
        ];
    }

    sort_targets(targets) {
        return targets.sort((a, b) => ((a.money.available - a.money.max) / a.hackTime) - ((b.money.available - b.money.max) / b.hackTime));
    }

    prepare_package(a, targets) {
        var bundles = [];
        var ram_used_this_bundle = 0;
        if (bundles.length == 0) { // nobody needed prep
            targets.forEach(target => {

                var percentage_hacked = 0.20;
                var hackThreads;
                var growThreads;
                var weakThreads1;
                var weakThreads2;
                var sec1;
                var sec2;

                var hackTime = target.hackTime;
                var growTime = hackTime * 3.2;
                var weakenTime = hackTime * 4;

                hackThreads = globalThis.ns.hackAnalyzeThreads(target.id, (target.money.max * percentage_hacked));
                growThreads = globalThis.ns.growthAnalyze(target.id, 1 / percentage_hacked);
        
                sec1 = hackThreads * 0.002;
                sec2 = growThreads * 0.004;
                weakThreads1 = sec1 / 0.05;
                weakThreads2 = sec2 / 0.05;

                let nextlaunchdate = new Date().valueOf() + Math.max(2000, weakenTime * 1.1);

                if (a.ram.free > ram_used_this_bundle + ((hackThreads + weakThreads1 + weakThreads2 + growThreads) * 1.8)) {
                    bundles.push(JSON.stringify({
                        file: "bin.hk.futureloop.js",
                        attacker: a.id,
                        threads: Math.max(1, Math.floor(hackThreads)),
                        args: [target.id, nextlaunchdate]
                    }));
                    bundles.push(JSON.stringify({
                        file: "bin.wk.futureloop.js",
                        attacker: a.id,
                        threads: Math.max(1, Math.ceil(weakThreads1)),
                        args: [target.id, nextlaunchdate+25]
                    }));
                    bundles.push(JSON.stringify({
                        file: "bin.gr.futureloop.js",
                        attacker: a.id,
                        threads: Math.max(1, Math.ceil(growThreads)),
                        args: [target.id, nextlaunchdate+50]
                    }));
                    bundles.push(JSON.stringify({
                        file: "bin.wk.futureloop.js",
                        attacker: a.id,
                        threads: Math.max(1, Math.ceil(weakThreads2)),
                        args: [target.id, nextlaunchdate+75]
                    }));
                  
                }
                ram_used_this_bundle += (hackThreads + weakThreads1 + weakThreads2 + growThreads) * 1.75;

            });

   
        }
        return bundles;
    }

    complete_when(t) {
        return (false);
    }

    iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids) {
        if (ns.read("var.debug.txt")) {} else {


            let pt = new PrettyTable();
            let headers = ["Under 100%", "At 100%"];
            let rows = [];
            for (let i = 0; i < targets.length; i++) {
                rows.push([
                    targets.filter(t => t.money.available / t.money.max < 1).map(t => t.id)[i] || "",
                    targets.filter(t => t.money.available / t.money.max >= 1).map(t => t.id)[i] || "",
                ]);
            }
            
            pt.create(headers, rows);
            globalThis.ns.clearLog();
            globalThis.ns.print(pt.print());
        }

        servers.filter(a => (a.ram.free / a.ram.max) > 0.5 ).forEach(p => p.status = semaphores.AVAILABLE);
        return {servers, attackers, bootstrapped, targets, filtered, executions, pids};
    }

}