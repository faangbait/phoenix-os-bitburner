// import either a real or a fake

import { LogicState } from "./lib.gamestates.so";
import { queueFactory, mergeModifiers } from "./lib.utils.so";

// import * as sing from "./fake.singularity.so";
import * as sing from "./lib.singularity.so";
// import * as facts from "./fake.singularity.so";
import * as facts from "./lib.singularity.so";
import * as corps from "./fake.singularity.so";
// import * as corps from "./lib.singularity.so";
import * as crimes from "./fake.singularity.so";
// import * as crimes from "./lib.singularity.so";
import * as sleeves from "./fake.singularity.so";
// import * as sleeves from "./lib.singularity.so";


// HOW TO USE THE LOGIC ENGINE

// BASE MODIFIERS -> In real application, these are gameStage class names probably
// let weights = new Map();
// weights.set("brush_teeth", 0);  // initialize with a default value. very likely to do this.
// weights.set("put_on_pajamas", 5); // less likely to do this
// weights.set("turn_off_lights", 10); // even less likely
// return weights

// let pq = queueFactory(weights);
// console.log(pq.peek()); // -> brush_teeth

// DEFINE MODIFIER FUNCTIONS

// const laziness = (laziness_factor=1.2) => {
//     let m = new Map();
//     m.set("brush_teeth", 1*laziness_factor) // laziness factor not likely to change whether I brush teeth
//     m.set("put_on_pajamas", 30*laziness_factor)  // but it could change whether I put on pajamas
//     m.set("turn_off_lights", 10*laziness_factor) // or turn off lights
//     return m
// }

// const dental_status = () => {
//     let m = new Map();
//     let has_teeth = false;
//     if (!has_teeth) {
//         m.set("brush_teeth", 1e20) // arbitrarily large number
//     }
//     return m
// }

// const electricity_bill = (kwh_rate) => {
//     let m = new Map();
//     m.set("turn_off_lights", weights.get("turn_off_lights") * kwh_rate); // we have a high electricity bill, we want to reduce the value of turn_off_lights to make it a higher priority
//     return m
// }

// ADD MODIFIER FUNCTIONS TO MODIFIERS LIST AND MERGE
// const kwh_rate = .25
// let modifiers = [laziness(), dental_status(), electricity_bill(kwh_rate)];
// let weighted_weights = mergeModifiers(weights, modifiers);
// let weighted_pq = queueFactory(weighted_weights);

// RESULT
// console.log(weighted_pq);
// console.log(weighted_pq.poll()); // -> turn_off_lights, the only item that wasnt modified to an extreme value
// console.log(weighted_pq.poll()); // -> put_on_pajamas -> laziness factor made this less likely but not impossible
// console.log(weighted_pq.poll()); // -> brush_teeth -> we set it to an arbitrarily large number because we have no neeth to brush



/**
 * Base logic to determine weightings for resource alloc strategy.
 * Note, this behaves the opposite of the hacking logic; LOW numbers get priority. 
 *
 * I want to structure this file as an attempt to generate values that represent
 * our _costs_ of going with a specific strategy, whereas logicHacking deals with
 * our _value_ for going with a specific strategy. After all, hacking generates
 * value; purchases have costs.
 * 
 * @param {import(".").NS} ns
 * @param {import("./phoenix-doc").ServerObject[]} servers
 * @param {import("./phoenix-doc").PlayerObject} player
 * @return {Map<string,number>} 
 */
const BaseModifiers = (ns, servers, player) => {
    let weights = new Map();
    weights.set(SPENDTHRIFT, -1); // if all numbers are >= 0, this will be the strategy.
    weights.set(STOCKMARKET, -1e30);

    // mirrors the gsMaxCash strategy // they should activate together
    var cash = player.money;
    var easy_money = servers.filter(s => s.level <= 100 && s.isTarget).map(s => s.money.available).reduce((a, b) => a + b, 0);
    switch (player.ports) {
        case 5:
            if (!player.market.api.fourSigma) {
                weights.set(SPENDTHRIFT, 25000000000 - (cash + easy_money)); // should resolve > 0 when cash+easy_money < 25b
            }
            break;
        case 4:
            weights.set(SPENDTHRIFT, 250000000 - (cash + easy_money)); // should resolve > 0 when cash+easy_money < 25b
            break;
        case 3:
            weights.set(SPENDTHRIFT, 30000000 - (cash + easy_money)); // should resolve > 0 when cash+easy_money < 25b
            break;
        case 2:
            weights.set(SPENDTHRIFT, 5000000 - (cash + easy_money)); // should resolve > 0 when cash+easy_money < 25b
            break;
        case 1:
            weights.set(SPENDTHRIFT, 1500000 - (cash + easy_money)); // should resolve > 0 when cash+easy_money < 25b
            break;
    }

    // this is flexible enough that bitnodes modifying hnet income will simply increase the payback period
    // we can do this without using the expensive hnet libraries by just building a ratio of costs
    // it's probably important for some other function, probably in singularity, to modify this such that
    // our final five augmentations, no matter the value of production, come from Netburners.
    // a reasonable strategy would be, on reset, if augs >= 25 < 30, only execute hnet strategy.
    // those augs are dirt cheap and rep is fast.

    let hnetCosts = {
        purchase: 3.2 * player.hnet.multipliers.purchaseCost,
        level: 1.1 * player.hnet.multipliers.levelCost,
        ram: Math.pow(1.035,(1.4 * player.hnet.multipliers.ramCost)),
        core: (1.55 * player.hnet.multipliers.coreCost) / 6,
        cache: 0
    };

    let sumcosts = (hnetCosts.level + hnetCosts.ram + hnetCosts.core + hnetCosts.purchase);
    let buytime = (1000 * Math.log(player.hnet.multipliers.production)) / sumcosts;
    // weights.set(HNET, (player.playtime.sinceAug / 1000) - buytime);


    // weights.set(BUYSERVERS, 0);

    /*
        import { STOCKMARKET } from ./logic.money.js

        JSON.stringify(
            [
                {
                    cls: STOCKMARKET,
                    val: 999999999999
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
 * @return {gs.DefaultMoneyStage}
 */
export async function determineResourceAllocation(ns, servers, player) {
    
    const weights = BaseModifiers(ns, servers, player);

    const modifiers = [
        await sing.msModifiers(ns, servers, player),
        await facts.msModifiers(ns, servers, player),
        await corps.msModifiers(ns, servers, player),
        await crimes.msModifiers(ns, servers, player),
        await sleeves.msModifiers(ns, servers, player)
    ];

    const weighted_weights = mergeModifiers(weights, modifiers);
    const pq = queueFactory(weighted_weights);

    return pq.poll();
}


class MoneyStrategy extends LogicState {

    /**
     * Reprovision Non-RAM Resources 
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
     static async init(ns, player, servers) { // Reprovision non-RAM resources
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
     static async cleanup(ns, player, servers) { // End of actions
        return {player, servers};
    }

    /**
     * When the logic decides a change of strategy is in order,
     * this wipes the game back to default state.
     *
     * @param {ns} ns
     * @param {PlayerObject} player
     * @param {ServerObject[]} servers
     * @memberof DefaultMoneyStage
     */
     static async sighup(ns, player, servers) { // End of actions
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
export class BUYSERVERS extends MoneyStrategy {
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
 * Stock market
 *
 * @export
 * @class StockMarket
 * @extends {MoneyStrategy}
 */
export class STOCKMARKET extends MoneyStrategy {
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

        static sighup(ns, player, servers) {
            ns.kill("sbin.market.js");
            return { player, servers };
        }
    
}

/**
 * Maximizing our hacknet node valuation.
  *
 * @export
 * @class Hnet
 * @extends {MoneyStrategy}
 */
 export class HNET extends MoneyStrategy {
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

    static sighup(ns, player, servers) {
        ns.kill("sbin.hnet.js");
        return { player, servers };
    }
}

/**
 * Blocks spending.
 *
 * @export
 * @class Spendthrift
 * @extends {MoneyStrategy}
 */
export class SPENDTHRIFT extends MoneyStrategy {
    static buy_things(ns, player, servers) {
        ns.tprint("A blocker is preventing you from buying anything.");
        return {player, servers};
    }
}

