export const StockTrader1 = {
    tests(params) { return StockTraderK.tests([1, params]); },
    answer(params) { return StockTraderK.answer([1, params]); }
};
export const StockTrader2 = {
    tests(params) { return StockTraderK.tests([params.length, params]); },
    answer(params) { return StockTraderK.answer([params.length, params]); }
};
export const StockTrader3 = {
    tests(params) { return StockTraderK.tests([2, params]); },
    answer(params) { return StockTraderK.answer([2, params]); }
};
export const StockTrader4 = {
    tests(params) { return StockTraderK.tests(params); },
    answer(params) { return StockTraderK.answer(params); }
};
export const StockTraderK = {
    solve(params) {
        let k = params[0];
        let prices = params[1];
        if (prices.length === 0) {
            return 0;
        }
        if (k > (prices.length / 2)) {
            let profit = 0;
            for (let i = 1; i < prices.length; i++) {
                if (prices[i] > prices[i - 1]) {
                    profit += prices[i] - prices[i - 1];
                }
            }
            return profit;
        }
        else {
            let dp = new Array(prices.length).fill(0);
            let size = prices.length;
            for (let t = 1; t <= k; t++) {
                let min = prices[0];
                let max = 0;
                for (let i = 0; i < size; i++) {
                    min = Math.min(min, prices[i] - dp[i]);
                    max = Math.max(max, prices[i] - min);
                    dp[i] = max;
                }
            }
            return dp.pop();
        }
    },
    tests(params) {
        [
            { params: [1, [7, 1, 5, 3, 6, 4]], solution: 5 },
            { params: [6, [7, 1, 5, 3, 6, 4]], solution: 7 },
            { params: [2, [3, 3, 5, 0, 0, 3, 1, 4]], solution: 6 },
            { params: [3, [10, 25, 38, 40, 45, 5, 58]], solution: 88 }, // Stock Trader IV
        ].forEach(t => {
            if (StockTraderK.solve(t.params) !== t.solution) {
                throw "Tests failed to pass";
            }
        });
        return StockTraderK.solve(params);
    },
    answer(params) { return StockTraderK.tests(params); }
};
