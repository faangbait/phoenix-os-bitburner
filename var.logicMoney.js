import * as gs from "./lib.gamestates.so";
import { hashpower, purchased, owned } from "./lib.utils.so";

/**
 * "What to buy" logic goes here.
 *
 * @param {ServerObject[]} servers
 * @param {PlayerObject} player
 * @return {gs.DefaultGameStage}
 */
export function determineResourceAllocation(servers, player) {
    var moneyStage = gs.DefaultMoneyStage;

    if (player.ports > 0) {

        const spendCompare = [
            {
                cls: gs.msPurchaseServers,
                compareFns: [
                    (purchased(servers).length < 25),
                    (hashpower(purchased(servers)) < 425) // all servers ~2^17 or higher, we stop sell-buying
                ]
            },
            {
                cls: gs.msHnet,
                compareFns: [
                    (player.hacking.level < (100 * (1 / player.hnet.multipliers.purchaseCost))),
                    (player.playtime.sinceAug < 4 * 60 * 1000)
                ]
            },
            {
                cls: gs.msSpendthrift,
                compareFns: [
                    (player.ports === 0 && player.money < 700 * 1000),
                    (player.ports === 1 && player.money < 1.5 * 1000 * 1000),
                    (player.ports === 2 && player.money < 5 * 1000 * 1000),
                    (player.hacking.level > 2000 && owned(servers).reduce((a, b) => a + b.ram.max) >= Math.pow(2, 20))
                ]
            },
            {
                cls: gs.msStockMarket,
                compareFns: [
                    (player.market.api.fourSigma == true && hashpower(owned(servers)) >= 250),
                    (player.market.api.fourSigma == true && owned(servers).reduce((a, b) => a + b.ram.max) >= 10e15),
                ]
            },
            {
                cls: gs.msReadyforAug,
                compareFns: [
                    (ns.readPort(1) == "READY FOR AUG"),
                    (player.money > Math.pow(10, 12)),
                    (servers.filter(s => s.id === String.fromCharCode(119, 48, 114, 49, 100, 95, 100, 52, 51, 109, 48, 110)).length > 0),
                ]
            }
        ];

        for (const stg of spendCompare) {
            for (const fn of stg.compareFns) {
                if (fn) {
                    moneyStage = stg.cls;
                }
            }
        }
    }
    return moneyStage;
}
