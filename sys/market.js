import { SYS_SCRIPTS } from "lib/Variables";
import { BitNodeCache } from "modules/bitnodes/BitnodeCache";
import { ServerCache } from "modules/servers/ServerCache";
import { StockCache } from "modules/stocks/StockCache";
import { StockFuncs } from "modules/stocks/StockFunctions";
let disableShorts = false;
let commission = 1e6;
let totalProfit = 0.0;
let allStockSymbols = [];
let mock = false;
let noisy = false;
const marketCycleLength = 75;
const maxTickHistory = 151;
const inversionDetectionTolerance = 0.10;
const inversionLagTolerance = 5;
const fracH = 0.01;
const fracB = 0.2;
const buy4sbudget = 0.8;
let marketCycleDetected = false;
let detectedCycleTick = 0;
let inversionAgreementThreshold = 6;
const expectedTickTime = 6000;
const catchUpTickTime = 4000;
let lastTick = 0;
let sleepInterval = 1000;
let bitnodeMults = 1;
export const main = async (ns) => {
    let player = ns.getPlayer();
    if (!player.hasTixApiAccess) {
        return;
    }
    let args = ns.args;
    if (args[0] === ("-l" || "--liquidate")) {
        await liquidate(ns);
    }
    let bitnodes = BitNodeCache.all(ns);
    let current = bitnodes.get("current");
    if (!disableShorts) {
        let bn8 = bitnodes.get("BitNode8");
        if ((current && current.number == 8) || bn8 && bn8.completed >= 2) { }
        else {
            disableShorts = true;
        }
    }
    if (current) {
        bitnodeMults = current.multipliers.tix;
    }
    if (!player.hasTixApiAccess) {
        let success = false;
        do {
            await ns.sleep(sleepInterval);
            try {
                success = await tryGetStockMarketAccess(ns, player, player.money * buy4sbudget);
            }
            catch { }
        } while (!success);
    }
    while (true) {
        try {
            player = ns.getPlayer();
            const reserve = null;
            const pre4s = player.has4SDataTixApi;
            const holdings = Array.from(StockCache.all(ns).values()).reduce((a, c) => a + StockFuncs.positionValue(ns, c), 0);
            const corpus = holdings + player.money;
            const maxHoldings = (1 - fracH) * corpus;
            if (pre4s && !mock && await tryGet4SApi(ns, player, bitnodeMults, corpus * buy4sbudget)) {
                continue;
            }
            // 
        }
        catch { }
    }
};
export const getAllStockSymbols = async (ns) => {
    return Array.from(StockCache.all(ns).keys());
};
export const tryGet4SApi = async (ns, player, bitnodeMults, budget) => {
    if (player.has4SDataTixApi) {
        return false;
    }
    const cost = 25e9 * bitnodeMults;
    if (cost > budget) {
        return false;
    }
    if (player.money < cost) {
        await liquidate(ns);
    }
    if (!player.has4SDataTixApi) {
        if (!ns.stock.purchase4SMarketDataTixApi()) {
            bitnodeMults *= 2;
        }
    } // TODO make file
};
export const tryGetStockMarketAccess = async (ns, player, budget) => {
    const wse = 200e6;
    const api = 5e9;
    const cost = (player.hasWseAccount ? 0 : wse) + api;
    if (cost > budget) {
        return false;
    }
    if (!player.hasWseAccount) {
        return ns.stock.purchaseWseAccount();
    }
    if (!player.hasTixApiAccess) {
        return ns.stock.purchaseTixApi();
    }
    return true;
};
export const liquidate = async (ns) => {
    StockCache.all(ns).forEach(s => {
        if (s.position.long_shares > 0) {
            StockFuncs.sell(ns, s);
        }
        if (s.position.short_shares > 0) {
            StockFuncs.sellShort(ns, s);
        }
    });
    ServerCache.read(ns, "home").pids.filter(proc => proc.filename == SYS_SCRIPTS.MARKET).forEach(proc => ns.kill(proc.pid));
};
