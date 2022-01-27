// Algorithmic Stock Trader I
// Given an array of integers, calculate the most profitable single trade

let solution_array = [90,12,159,84,199,140,60,23,127,132,185,56,10,20,77,6,44,36,113,45,196,10,167,84,17,117,70,136,160,86,155,185,15,126,72,186,192,175,198,56,85,82,169,96,197,14,118,197,78,39];

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
    array.reduce(function (accumulator, current, idx, arr) {
        if (arr[idx+1] > current){
            // console.log("Index ", idx, " profit ", (arr[idx+1]-current), " cumulatively ", accumulator);
            return accumulator + (arr[idx+1]-current);
        } else { return accumulator || 0; }
    }, 0);
}
console.log("STOCK II: CUMULATIVE PROFIT", stockII);

// Algorithmic Stock Trader III
// Given an array of integers, calculate the maximum possible profit in two non-overlapping transactions


// Algorithmic Stock Trader IV
// Given an array of [k, [integers]], calculate the maximum possible profit in k trades

