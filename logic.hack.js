import * as sing from "./lib.singularity.so";
import * as facts from "./lib.singularity.so";
// import * as corps from "./lib.singularity.so";
// import * as crimes from "./lib.singularity.so";
// import * as sleeves from "./lib.singularity.so";
// import * as sing from "./fake.singularity.so";
// import * as facts from "./fake.singularity.so";
import * as corps from "./fake.singularity.so";
import * as crimes from "./fake.singularity.so";
import * as sleeves from "./fake.singularity.so";

import { mergeModifiers, queueFactory } from "./lib.utils.so";
import { LogicState } from "./lib.gamestates.so";
import hwgwww from "./strategy.hwgw2";
import Default from "./strategy.base";
import CashOut from "./strategy.maxcash";
import Represent from "./strategy.rep";

// HOW TO USE THE LOGIC ENGINE : REFER TO LOGIC.MONEY.JS

/**
 * Base logic to determine weightings for resource alloc strategy
 * 
 * @param {import(".").NS} ns
 * @param {import("./phoenix-doc").ServerObject[]} servers
 * @param {import("./phoenix-doc").PlayerObject} player
 * @return {Map<string,number>} 
 */
const BaseModifiers = (ns, servers, player) => {
    // the largest integer (positive) we return will be selected as the preferred strategy
    // this means these functions should probably learn logarithmic representations of profit/potential
    // under each strategy.
    let weights = new Map();

    // If all other strategies resolve to <= 0, default will activate
    weights.set(DEFAULT, 1);

    // hwgw increases in priority for every server we own 1TB or higher. 
    // hwgw profit is defined as: server size for servers > 1TB
    // as it tends to be an efficient strategy, it needs no additional modifiers

    weights.set(HWGW, servers.filter(s => s.isAttacker && s.power >= 9).map(s => s.power).reduce((a, b) => a + b, -9));

    // the NewGame strategy generates significantly increased earnings over Default in new-game scenarios
    // however, its profit reverts to the profit of default after a port is acquired
    weights.set(NEWGAME, 2 - player.ports);

    // the MaxCash strategy should be used dynamically to acquire specific upgrades that significantly increase rate of return
    // it should swell in value in the twenty or thirty minutes prior to augmentation reset; this is handled under sing modifiers

    // targeted upgrade: each new port, 4SAPI access @ 25 billion
    weights.set(MAXCASH, 0);

    var cash = player.money;
    var easy_money = servers.filter(s => s.level <= 100 && s.isTarget).map(s => s.money.available).reduce((a, b) => a + b, 0);

    switch (player.ports) {
        case 5:
            if (!player.market.api.fourSigma) {
                weights.set(MAXCASH, (cash + easy_money) - 25000000000); // should resolve < 0 when cash+easy_money < 25b
            }
            break;
        case 4:
            weights.set(MAXCASH, (cash + easy_money) - 250000000); // should resolve < 0 when cash+easy_money < 25b
            break;
        case 3:
            weights.set(MAXCASH, (cash + easy_money) - 30000000); // should resolve < 0 when cash+easy_money < 25b
            break;
        case 2:
            weights.set(MAXCASH, (cash + easy_money) - 5000000); // should resolve < 0 when cash+easy_money < 25b
            break;
        case 1:
            weights.set(MAXCASH, (cash + easy_money) - 1500000); // should resolve < 0 when cash+easy_money < 25b
            break;
    }

    // Rep should be used dynamically to acquire specific reputation levels prior to augmentation.
    // This is handled exclusively by singularity scripts
    weights.set(REP, 0);


    /*


        JSON.stringify(
            [
                {
                    cls: "gsNewGame",
                    val: 0
                }
            ]
        );

    */

    try {
        let overrides = JSON.parse(globalThis.ns.read("strategy.override.txt"));
        weights.set(overrides.cls, overrides.val);
    } catch (e) {}

    return weights;
};

/**
 * Internal function. Don't modify. Modify modifier functions.
 * 
 * @param {ServerObject[]} servers
 * @param {PlayerObject} player
 */

export async function determineHackStrategy(ns, servers, player) {

    const weights = BaseModifiers(ns, servers, player);

    const modifiers = [
        await sing.gsModifiers(ns, servers, player),
        await facts.gsModifiers(ns, servers, player),
        await corps.gsModifiers(ns, servers, player),
        await crimes.gsModifiers(ns, servers, player),
        await sleeves.gsModifiers(ns, servers, player)
    ];

    const weighted_weights = mergeModifiers(weights, modifiers);
    const pq = queueFactory(weighted_weights, true);

    return pq.poll();
}


class HackStrategy extends LogicState {
    constructor(){super();}

    static async init(ns, player, servers) {
        return { player, servers };
    }
  
    /**
     * Returns a new instance of the selected strategy.
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject} servers
     * @return {Default} 
     * @memberof DefaultGameStage
     */
    static select_algorithm(ns, player, servers) {
        const algo = new Default(ns, player, servers);
        return algo;
    }
    
    /**
     * DO NOT OVERLOAD - use pre_hack() and post_hack()
     * 
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @param {Default} algo
     * @see select_algorithm()
     * @see pre_hack()
     * @see post_hack()
     * @memberof DefaultGameStage
     */

    static do_hack(ns, player, servers) { 
        const algo = this.select_algorithm(ns, player, servers);
        
        let attackers = algo.__qualify(servers);
        let bootstrapped = algo.__bootstrap(attackers);
        let targets = algo.__target(servers);
        let filtered = algo.__filter_targets(targets);
        let executions = algo.__package(bootstrapped, filtered);
        let pids = algo.__deploy(executions);
        (
            { servers, attackers, bootstrapped, targets, filtered, executions, pids } = 
            algo.__iterate(servers, attackers, bootstrapped, targets, filtered, executions, pids)
        );
        
        return {player, servers};
    }

    static async cleanup(ns, player, servers) {
        return { player, servers };
    }

    static sighup(ns, player, servers) {
        servers.forEach(s => s.pids.filter(pid => pid.filename.startsWith("bin.")).forEach(process => ns.kill(process.pid)));
        return { player, servers };
    }
}
export class NEWGAME extends HackStrategy {
    constructor() {
        super();
    }
    /**
     * Prescriptive early game
     *
     * @static
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof gsNewGame
     */
    static async init(ns, player, servers) {
        if (!this.target) {
            this.target = "foodnstuff";
        }
        if (player.ports === 0 || this.target == "joesguns") { // if you're on a different bitnode, this won't work. i've left a more extensible script below.
            for (const s of servers.filter(s => !s.admin)) { // by the end of the second loop, you'll have enough to upgrade ram, script will spawn Phoenix.
                if (player.ports >= s.ports.required) {
                    ns.tprint("Attempting sudo on ", s);
                    s.sudo();
                    await s.loadBinaries();
                    if (s.threadCount(1.7) >= 1) {
                        ns.exec("bin.hk.loop.js", s.id, s.threadCount(1.7, true), this.target, 0);
                    }
                }
            }

            for (const s of servers.filter(s => s.admin)) {
                if (s.threadCount(1.7) >= 1) {
                    ns.exec("bin.hk.loop.js", s.id, s.threadCount(1.7, true), this.target, 0);
                }
            }
        } else {
            if (servers.filter(s => s.id == "CSEC" && !s.admin)) {
                this.target = "joesguns";
                await ns.writePort(1, JSON.stringify({
                    request: "SIGHUP"
                })); //kills everything
                await ns.sleep(40000);
                ns.clearPort(1);
            }
        }
        return {
            player,
            servers
        };
    }

    static select_algorithm(ns, player, servers) {
        const algo = new Default(ns, player, servers);
        return algo;
    }
}

export class DEFAULT extends HackStrategy {
    constructor(){super();}

    static select_algorithm(ns, player, servers) {
        const algo = new Default(ns, player, servers);
        return algo;
    }    
}
/**
 * Distributed HWGW workload. Maximizes efficiency by distributing 'weaken' commands
 * to multiple (smaller) servers.
 * 
 * - Divide and conquer algorithm
 * - Runs on ~100ms loops
 * - Guarantees resources available before attempting a batch
 * - Selects targets via priority queue
 * - If insufficient targets available, runs a prep stage
 * 
 * @export
 * @class hsHWGW
 * @extends {HackStrategy}
 */
export class HWGW extends HackStrategy {
    constructor(){super();}

    static async init(ns, player, servers) {

        const filter_ready = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.isTarget) &&
                    (s.money.available / s.money.max == 1) &&
                    (s.security.level - s.security.min == 0);
            });
        };

        let top_attackers = servers.filter(s => s.isAttacker && s.ram > 8);

        while (filter_ready(servers, player).length < 8 && top_attackers.length >=1 ) {
            // top_attackers = Array.from([...servers.filter(s => s.isAttacker && s.ram > 8)]);
            top_attackers = servers.filter(s => s.isAttacker && s.ram.free > 8);
            top_attackers.sort((a, b) => b.ram.max - a.ram.max);

            let ready_list = filter_ready(servers, player).map(s => s.id).filter(s => s.id != "home");

            let next_targets = servers.filter(s => !ready_list.includes(s.id) && s.isTarget);
            next_targets.sort((a, b) => (a.level - b.level));
            // next_targets.sort((a,b) => ((b.money.available / b.money.max) * (b.security.level / b.security.min)) - ((a.money.available / a.money.max) * (a.security.level / a.security.min)));

            if (next_targets.length > 0 && top_attackers.length > 0) {
                for (let i = 0; i < Math.min(next_targets.length, top_attackers.length); i++) {
                    ns.exec("bin.prep.js", top_attackers[i].hostname, top_attackers[i].threadCount(3.3, false), next_targets[i].hostname);
                    ns.print("Preparing to ready ", next_targets[i].id);
                }
            }
            await ns.sleep(200);
        }

        return {
            player,
            servers
        };
    }

    static select_algorithm(ns, player, servers) {
        const algo = new hwgwww(ns, player, servers);
        return algo;

    }
}

export class MAXCASH extends HackStrategy {
    constructor(){super();}
    
    static select_algorithm(ns, player, servers) {
        const algo = new CashOut(ns, player, servers);
        return algo;
    }
}

export class REP extends HackStrategy {
    static select_algorithm(ns, player, servers) {
        const algo = new Represent(ns, player, servers);
        return algo;
    }
}