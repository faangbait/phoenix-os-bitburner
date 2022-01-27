// Algorithmic Stock Trader I
// Given an array of integers, calculate the most profitable single trade

let solution_array = [141,150,148,185,198,15,157];

const find_best_single_trade = (array) => {
    let best_single_trade = 0;
    let idx = 0;
    for (let cur of array) {
        for (let rest of array.slice(idx)) {
            if ((rest - cur) > best_single_trade) {
                best_single_trade = rest-cur;
            }
        }
        idx++;
    }
    return best_single_trade;
};

console.log("STOCK I: BEST SINGLE TRADE PRICE = ", find_best_single_trade(solution_array));


// Algorithmic Stock Trader II
// Given an array of integers, calculate the maximum possible profit in unlimited transactions.

const find_cumulative_profit = (array) => {
    return array.reduce(function (accumulator, current, idx, arr) {
        if (arr[idx+1] > current){
            // console.log("Index ", idx, " profit ", (arr[idx+1]-current), " cumulatively ", accumulator);
            return accumulator + (arr[idx+1]-current);
        } else { return accumulator || 0; }
    }, 0);
};

console.log("STOCK II: CUMULATIVE PROFIT", find_cumulative_profit(solution_array));

// Algorithmic Stock Trader III
// Given an array of integers, calculate the maximum possible profit in two non-overlapping transactions


// Algorithmic Stock Trader IV
// Given an array of [k, [integers]], calculate the maximum possible profit in k trades

