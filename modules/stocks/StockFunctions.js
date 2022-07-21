import { PlayerInfo } from "modules/players/Players";
export const StockFuncs = {
    sell(ns, stock, shares) {
        if (!shares) {
            shares = stock.position.long_shares;
        }
        return ns.stock.sell(stock.ticker, shares);
    },
    buy(ns, stock, shares) {
        if (!shares) {
            shares = StockFuncs.__max_long(ns, stock);
        }
        return ns.stock.buy(stock.ticker, shares);
    },
    __max_long(ns, stock) {
        return Math.floor(PlayerInfo.detail(ns).money / stock.price.ask);
    },
    __max_short(ns, stock) {
        return Math.floor(PlayerInfo.detail(ns).money / stock.price.bid);
    },
    short(ns, stock, shares) {
        if (!shares) {
            shares = StockFuncs.__max_short(ns, stock);
        }
        return ns.stock.short(stock.ticker, shares);
    },
    sellShort(ns, stock, shares) {
        if (!shares) {
            shares = stock.position.short_shares;
        }
        return ns.stock.sellShort(stock.ticker, shares);
    },
    positionValue(ns, stock) {
        return (stock.position.long_shares * stock.price.bid) +
            (stock.position.short_shares * (2 * stock.position.short_price - stock.price.ask));
    }
};
