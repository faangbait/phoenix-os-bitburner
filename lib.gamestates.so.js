/**
 * @typedef {import(".").NS} ns
 * @typedef {import("./phoenix-doc").PlayerObject} PlayerObject
 * @typedef {import("./phoenix-doc").ServerObject} ServerObject
 *
 */

 import Default from "./strategy.base";
 import CashOut from "./strategy.maxcash";
 import Represent from "./strategy.rep";
 import Balanced from "./strategy.efficiency";
import GoodGuy from "./strategy.nohacks";
import { loop_time } from "./var.constants";
import hwgw from "./strategy.hwgw";
/**
 * Takes actions based on the current game state.
 * Game states are set via logic in Phoenix.js.
 * 
 * @class GameState
 */
 class GameState {
    /**
     * Creates an instance of GameState.
     * @param {ns} ns
     * @param {PlayerObject} player
     * @memberof GameState
     */
}

/**
 * Deals with RAM resources, servers, hacking, etc.
 *
 * @export
 * @class DefaultGameStage
 * @extends {GameState}
 */

export class DefaultGameStage extends GameState {
    /**
     * Reprovision RAM resources
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultGameStage
     */

    static async untap(ns, player, servers) { 
        return {player, servers};
    }

    /**
     * Do whatever you want, we're about to go hacking.
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultGameStage
     */
    static async pre_hack(ns, player, servers) { 
        return {player, servers};
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
    static hack(ns, player, servers) { 
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

    /**
     * Endstep for hacking actions
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultGameStage
     */
    static async post_hack(ns, player, servers) { 
        return {player, servers};
    }


}

/**
 * A very early stage of the game. we want to be as prescriptive as possible here.
 *
 * @export
 * @class gsNewGame
 * @extends {DefaultGameStage}
 */
export class gsNewGame extends DefaultGameStage {
    constructor() {super();}

    /**
     * Prescriptive early game
     *
     * @static
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof gsNewGame
     */
    static async untap(ns,player,servers) {
        let home = servers.filter(s => s.hostname == "home")[0];
        let n00dles = servers.filter(s => s.hostname == "n00dles")[0];
        let foodnstuff = servers.filter(s => s.hostname == "foodnstuff")[0];


        while (servers.filter(s => s.admin).length < 3) {
            ns.exec("sbin.sudo.js", "home", 1, "n00dles");
            await ns.sleep(250);
            ns.exec("sbin.sudo.js", "home", 1, "foodnstuff");
            await ns.sleep(800);
        }

        ns.exec("bin.gr.loop.js", "n00dles", 1, "foodnstuff");
        ns.exec("bin.wk.loop.js", "n00dles", 1, "foodnstuff");
        ns.exec("bin.gr.loop.js", "foodnstuff", 9, "foodnstuff");
        await ns.sleep(800);
    
        while (player.level < 5) {
            let curtime = new Date().valueOf();
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "n00dles");
            await ns.sleep(n00dles.hackTime + 2000);
            curtime = new Date().valueOf();
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
            await ns.sleep(foodnstuff.hackTime + 55);
        }

        while (servers.filter(s => s.admin).length < 4) {
            ns.exec("sbin.sudo.js", "home", 1, "sigma-cosmetics");
            await ns.sleep(400);
        }
        
        ns.exec("bin.wk.loop.js", "sigma-cosmetics", 1, "foodnstuff");
        ns.exec("bin.gr.loop.js", "sigma-cosmetics", 8, "foodnstuff");

        while (player.level < 10) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }

        while (servers.filter(s => s.admin).length < 5) {
            ns.exec("sbin.sudo.js", "home", 1, "joesguns");
            await ns.sleep(400);
        }
        await ns.sleep(400);
        ns.exec("bin.wk.loop.js", "joesguns", 1, "foodnstuff");
        ns.exec("bin.gr.loop.js", "joesguns", 8, "foodnstuff");

        while (player.level < 20) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }
        while (servers.filter(s => s.admin).length < 6) {
            ns.exec("sbin.sudo.js", "home", 1, "nectar-net");
            await ns.sleep(400);
        }

        ns.exec("bin.wk.loop.js", "nectar-net", 1, "foodnstuff");
        ns.exec("bin.gr.loop.js", "nectar-net", 8, "foodnstuff");

        while (player.level < 30) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }
        while (servers.filter(s => s.admin).length < 7) {
            ns.exec("sbin.sudo.js", "home", 1, "hong-fang-tea");
            await ns.sleep(400);
        }
    
        ns.exec("bin.wk.loop.js", "hong-fang-tea", 1, "foodnstuff");
        await ns.sleep(100);
        ns.exec("bin.gr.loop.js", "hong-fang-tea", 8, "foodnstuff");
        await ns.sleep(100);

        while (player.level < 40) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }
        while (servers.filter(s => s.admin).length < 8) {
            ns.exec("sbin.sudo.js", "home", 1, "harakiri-sushi");
            await ns.sleep(400);
        }

        ns.exec("bin.wk.loop.js", "harakiri-sushi", 1, "foodnstuff");
        await ns.sleep(100);
        ns.exec("bin.gr.loop.js", "harakiri-sushi", 8, "foodnstuff");
        await ns.sleep(100);

        while (player.level < 50) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }
        while (servers.filter(s => s.admin).length < 9) {
            ns.purchaseTor();
            ns.purchaseProgram("brutessh.exe");

            ns.exec("sbin.sudo.js", "home", 1, "neo-net");
            await ns.sleep(400);
        }

        ns.exec("bin.wk.loop.js", "neo-net", 2, "foodnstuff");
        await ns.sleep(100);
        ns.exec("bin.gr.loop.js", "neo-net", 16, "foodnstuff");
        await ns.sleep(100);

        while (player.level < 59) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }

        while (servers.filter(s => s.admin).length < 10) {
            ns.exec("sbin.sudo.js", "home", 1, "CSEC");
            await ns.sleep(400);
        }

  
        ns.exec("bin.wk.loop.js", "CSEC", 4, "foodnstuff");
        await ns.sleep(100);

        while (player.level < 75) {
            await ns.sleep(foodnstuff.hackTime + 55);
            ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), "foodnstuff");
        }
        while (player.ports < 1) {
            await ns.sleep(foodnstuff.hackTime + 55);

            for (let s of servers.filter(s => s.admin && s.money.available > 0))
            {
                ns.toast("Open a port to continue", "error", s.hackTime + 55);
                ns.exec("bin.hk.once.js", "home", home.threadCount(1.7), s.hostname);
                await ns.sleep(s.hackTime + 55);
            }
        }

        await ns.sleep(1000);

        if (ns.ps("home").every(process => process.filename != "sbin.hnet.js")) {
             let hnet_pid = ns.exec("sbin.hnet.js", "home");
             await ns.sleep(5000);
             ns.kill(hnet_pid);
        }
        

        return {player,servers};
    }

    static select_algorithm(ns, player, servers) {
        const algo = new Default(ns, player, servers);
        return algo;

    }
}

/**
 * Prior to acquiring CyberSec faction membership
 *
 * @export
 * @class gsEarlyGame
 * @extends {DefaultGameStage}
 */
export class gsEarlyGame extends DefaultGameStage {
    constructor(){super();}

    static select_algorithm(ns, player, servers) {
        const algo = new Default(ns, player, servers);
        return algo;
    }
}

/**
 * Prior to acquiring Bitrunners faction membership
 *
 * @export
 * @class gsMidGame
 * @extends {DefaultGameStage}
 */
export class gsMidGame extends DefaultGameStage {
    constructor(){super();}

    static async pre_hack(ns, player, servers) {
        // let top_attackers = servers.filter(s => s.admin && s.ram.free >= 1024);
        // top_attackers.sort((a,b) => b.ram.max - a.ram.max);
        // let top_targets = servers.filter(s => s.admin && s.money.max > 0 && s.targeted_by.length == 0);
        // top_targets = top_targets.filter(s => s.money.max - s.money.available > 0 || s.security.level - s.security.min > 0);
        // top_targets.sort((a,b) => (a.security.level - a.security.min) - (b.security.level - b.security.min));
        // for (let i = 0; i < Math.min(top_targets.length, top_attackers.length); i++) {
        //     // ns.exec("/utils/deploy.js", "home", 1, top_attackers[i].hostname, "bin.prep.js", top_targets[i].hostname);
        //     ns.exec("bin.scp.js", "home", 1, top_attackers[i].hostname, "bin.prep.js");
        //     ns.exec("bin.prep.js",  top_attackers[i].hostname, top_attackers[i].threadCount(3.30), top_targets[i].hostname);
        // }
        // return { player, servers };

        const filter_ready = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.available / s.money.max == 1) &&
                    (s.level < player.level) &&
                    (s.security.level - s.security.min == 0);
            });
        };
        const filter_preptargets = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.max > s.money.available) &&
                    (s.level < player.level) &&
                    (s.security.level > s.security.min) &&
                    (s.targeted_by.length == 0);
            });
        };

        let prepared_targets = filter_ready(servers, player);
    
        let top_attackers = servers.filter(s => s.admin && s.ram.free >= 512);
        top_attackers.sort((a, b) => b.ram.max - a.ram.max);

        let next_targets = filter_preptargets(servers, player);
        if (next_targets.length > 0 && top_attackers.length > 0) {
            await ns.scp("bin.prep.js", "home", top_attackers[0].hostname);
            ns.exec("bin.prep.js", top_attackers[0].hostname, top_attackers[0].threadCount(3.30, true), next_targets[0].hostname);
        }

        ns.print("Preparing to ready ", next_targets[0].id);


        return {player, servers};
    }

    static select_algorithm(ns, player, servers) {
        const algo = new hwgw(ns, player, servers);
        return algo;

    }
}

/**
 * Prior to acquiring The Red Pill
 *
 * @export
 * @class gsLateGame
 * @extends {DefaultGameStage}
 */
export class gsLateGame extends DefaultGameStage {
    constructor(){super();}

    static select_algorithm(ns, player, servers) {
        const algo = new Represent(ns, player, servers);
        return algo;

    }
}

/**
 * Prior to backdooring the Bitnode
 *
 * @export
 * @class gsEndGame
 * @extends {DefaultGameStage}
 */
export class gsEndGame extends DefaultGameStage {
    constructor(){super();}

    static select_algorithm(ns, player, servers) {
        const algo = new CashOut(ns, player, servers);
        return algo;

    }
}

export class gsRepair extends DefaultGameStage {
    constructor(){super();}
    static async pre_hack(ns, player, servers) {
        // let top_attackers = servers.filter(s => s.admin && s.ram.free > 4);
        // let top_targets = servers.filter(s => s.admin && s.money.max > 0 && s.targeted_by.length == 0);
        // top_targets = top_targets.filter(s => s.money.max - s.money.available > 0 || s.security.level - s.security.min > 0);
        
        // top_targets.sort((a,b) => (a.security.level - a.security.min) - (b.security.level - b.security.min));
        // top_attackers.sort((a,b) => b.ram.free - a.ram.free);
        // for (let i = 0; i < Math.min(top_targets.length, top_attackers.length); i++) {
        // //     ns.exec("/utils/deploy.js", "home", 1, top_attackers[i].hostname, "bin.prep.js", top_targets[i].hostname);
        //     ns.exec("sbin.scp.js", "home", 1, top_attackers[i].hostname, "bin.prep.js");
        //     ns.exec("bin.prep.js",  top_attackers[i].hostname, top_attackers[i].threadCount(3.30), top_targets[i].hostname);
        // }
        
        // return { player, servers };

        const filter_ready = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.available / s.money.max == 1) &&
                    (s.level < player.level) &&
                    (s.security.level - s.security.min == 0);
            });
        };
        const filter_preptargets = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.max > s.money.available) &&
                    (s.level < player.level) &&
                    (s.security.level > s.security.min) &&
                    (s.targeted_by.length == 0);
            });
        };

        let prepared_targets = filter_ready(servers, player);
    
        let top_attackers = servers.filter(s => s.admin && s.ram.free >= 512);
        top_attackers.sort((a, b) => b.ram.max - a.ram.max);

        let next_targets = filter_preptargets(servers, player);
        if (next_targets.length > 0 && top_attackers.length > 0) {
            await ns.scp("bin.prep.js", "home", top_attackers[0].hostname);
            ns.exec("bin.prep.js", top_attackers[0].hostname, top_attackers[0].threadCount(3.30, true), next_targets[0].hostname);
        }

        ns.print("Preparing to ready ", next_targets[0].id);


        return {player, servers};
    }

    static select_algorithm(ns, player, servers) {
        const algo = new GoodGuy(ns, player, servers);
        return algo;

    }
}

export class gsReadyForAug extends DefaultGameStage {
    constructor(){super();}

    static select_algorithm(ns, player, servers) {
        const algo = new Represent(ns, player, servers);
        return algo;
    }

    // static select_algorithm(ns, player, servers) {
    //     const algo = new hwgw(ns, player, servers);
    //     return algo;
    // }
}

/**
 * Deals with spending money, rep, etc.
 *
 * @export
 * @class DefaultMoneyStage
 * @extends {GameState}
 */
export class DefaultMoneyStage extends GameState {

    /**
     * Reprovision Non-RAM Resources 
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
    static upkeep(ns, player, servers) { // Reprovision non-RAM resources
        return {player, servers};
    }

    /**
     * Spend assets; money, rep, etc. 
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
    static buy_things(ns, player, servers) { // Spend assets (rep, cash)
        return {player, servers};
    }

    /**
     * Prior to completing a loop; very last actions
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
    static async end_step(ns, player, servers) { // End of actions
        await ns.sleep(loop_time);
        return {player, servers};
    }
}

/**
 * Attempting to acquire the ideal compliment of Purchased Servers
 *
 * @export
 * @class msPurchaseServers
 * @extends {DefaultMoneyStage}
 */
export class msPurchaseServers extends DefaultMoneyStage {
    /**
     * Calculations
     *
     * @static
     * @param {ServerObject[]} servers
     * @memberof msPurchaseServers
     */
    static getPurchasedServerQuality(servers) {
        // [ ranges 1-20 where 2^minServerSize = size in GB. default is 64GB ]
        const minServerSize = Math.max(6, servers.filter(s => s.isHome)[0].power);
        
        let strongestServers = servers.sort((a, b) => b.ram.max - a.ram.max);
        strongestServers = strongestServers.filter(s => s.purchased); // doing it in this order means we can always get a server
        let weakestServers = servers.sort((a, b) => a.ram.max - b.ram.max);
        weakestServers = weakestServers.filter(s => s.purchased);
        
        let nextUpgrade = minServerSize;
        if (strongestServers.length > 0) {
            nextUpgrade = Math.min(20, strongestServers[0].power + 1);
        }
    
        return {
            strongestServers,
            nextUpgrade,
            weakestServers
        };
    }
    /**
     * Handles the purchase server logic.
     *
     * @static
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof msPurchaseServers
     */
    static buy_things(ns, player, servers) {
        const maxServers = 25;
  
        function ram(power) {
            return Math.pow(2, power);
        }

        function purchaseCost(power) {
            return ram(power) * 55000;
        }

        function canAffordServer(power) {
            return player.money >= purchaseCost(power);
        }

        var {
            strongestServers,
            nextUpgrade,
            weakestServers
        } = this.getPurchasedServerQuality(servers);

        if (strongestServers.length === maxServers && canAffordServer(nextUpgrade) && weakestServers[0].power < 18) {
            ns.exec("/etc.delete_server.js", "home", 1, weakestServers[0].id);
            // ns.tprint("Sold a server. Now we have ", strongestServers.length - 1);
            servers = servers.filter(s => s.id != weakestServers[0].id);
        }

        if (strongestServers.length < maxServers && canAffordServer(nextUpgrade)) {
            ns.exec("/etc.purchase_server.js", "home", 1, ram(nextUpgrade));
            // ns.tprint("Purchased a server. Now we have ", strongestServers.length + 1, ". Highest RAM: ", ram(nextUpgrade));
        }
        
        return {player, servers};
    }
}

/**
 * Maximizing our value in the market
 *
 * @export
 * @class msStockMarket
 * @extends {DefaultMoneyStage}
 */
export class msStockMarket extends DefaultMoneyStage {
    /**
     * Launches a fully-automated market management plugin.
     * Plugin is external to the script because it's high RAM usage.
     *
     * @static
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof msStockMarket
     */
    static buy_things(ns, player, servers) {
        if (ns.ps("home").every(process => process.filename != "sbin.market.js")) {
            ns.exec("sbin.market.js", "home");
        }
        return {player, servers};
    }
}

/**
 * Maximizing our hacknet node valuation.
  *
 * @export
 * @class msHnet
 * @extends {DefaultMoneyStage}
 */
export class msHnet extends DefaultMoneyStage {
    /**
     * Launches a fully-automated hacknet bot.
     * Plugin is external to the script because it's high RAM usage.
     * 
     * @static
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof msHnet
     */
    static buy_things(ns, player, servers) {
        if (ns.ps("home").every(process => process.filename != "sbin.hnet.js")) {
            ns.exec("sbin.hnet.js", "home");
        }
        return {player, servers};
    }
}

export class msSpendthrift extends DefaultMoneyStage {
    static buy_things(ns, player, servers) {
        ns.tprint("A blocker is preventing you from buying anything.");
        return {player, servers};
    }
}

/**
 * After sufficient assets are attained, install augments and restart
 *
 * @export
 * @class msReadyforAug
 * @extends {DefaultMoneyStage}
 */
export class msReadyforAug extends DefaultMoneyStage {
    /**
     * Prepares the user to undertake a reaugmentation. Excluded due to requirement on SF4
     *
     * @static
     * @param {*} ns
     * @param {*} player
     * @param {*} servers
     * @return {*} 
     * @memberof msReadyforAug
     */
    static async end_step(ns, player, servers) {
        ns.toast("You're ready to install augments!", "info", 60000);
        // kill all scripts
        // ns.ps("home").filter(process => process.filename != "phoenix.js").forEach(process => ns.kill(process.pid));
        if (ns.ps("home").every(process => process.filename != "sbin.market.js")) {
            ns.exec("sbin.market.js", "home", 1, "SELLOFF");
        }
        
        await ns.sleep(6000);
        let aug_list = [ // in order of preference
            "Hacknet Node CPU Architecture Neural-Upload",
            "Hacknet Node Cache Architecture Neural-Upload",
            "Hacknet Node Core Direct-Neural Interface",
            "Hacknet Node Kernel Direct-Neural Interface",
            "Hacknet Node NIC Architecture Neural-Upload",
            "Cranial Signal Processors - Gen I",
            "Cranial Signal Processors - Gen II",
            "Cranial Signal Processors - Gen III",
            "Cranial Signal Processors - Gen IV",
            "Embedded Netburner Module",
            "Artificial Synaptic Potentiation",
            "Neurotrainer II",
            "Neurotrainer I",
            "Bitwire",
            "Synaptic Enhancement Implant",
            "Neuralstimulator",
            "Enhanced Myelin Sheathing",
            "CRTX42-AA Gene Modification",
            "DataJack",
            "The Black Hand",
            "CashRoot Starter Kit",
            "Embedded Netburner Module Core V2 Upgrade",
            "Bitrunners Neurolink",
            "Artificial Bio-neural Network Implant",
            "Cranial Signal Processors - Gen V",
            "Neural Accelerator"
        ];
        // buy all augs for faction
        // max upgrade home ram
        // upgrade home cores at most once
        // max neuroflux
        // reset via a function
        return {player, servers};
    }
}

//********* DEV **********/
export class gsdebugStage extends DefaultGameStage {
    constructor() {super();}

    static async post_hack(ns, player, servers) {

        const filter_ready = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.available / s.money.max == 1) &&
                    (s.level < player.level) &&
                    (s.security.level - s.security.min == 0);
            });
        };
        const filter_preptargets = (servers, player) => {
            servers.sort((a, b) => a.level - b.level);
            return servers.filter(function (s) {
                return (s.admin) &&
                    (!s.purchased) &&
                    (s.money.max > 0) &&
                    (s.money.max > s.money.available) &&
                    (s.level < player.level) &&
                    (s.security.level > s.security.min) &&
                    (s.targeted_by.length == 0);
            });
        };

        let prepared_targets = filter_ready(servers, player);
    
        let top_attackers = servers.filter(s => s.admin && s.ram.free >= 512);
        top_attackers.sort((a, b) => b.ram.max - a.ram.max);

        let next_targets = filter_preptargets(servers, player);
        if (next_targets.length > 0 && top_attackers.length > 0) {
            await ns.scp("bin.prep.js", "home", top_attackers[0].hostname);
            ns.exec("bin.prep.js", top_attackers[0].hostname, top_attackers[0].threadCount(3.30, true), next_targets[0].hostname);
        }

        ns.print("Preparing to ready ", next_targets[0].id);


        return {player, servers};
    }

    static select_algorithm(ns, player, servers) {
        ns.tprint("Debug");
        const algo = new hwgw(ns, player, servers);
        return algo;

    }
}
