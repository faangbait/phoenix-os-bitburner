// It is possible write four as a sum in exactly four different ways:
// 3 + 1
// 2 + 2
// 2 + 1
// 1 + 1
// How many different distinct ways can the number ${n} be written as a sum of at least two positive integers?
export const TotalWaysToSum = {
    solve(params) {
        let N = params;
        let K = N - 1;
        // Initialize a list
        let dp = Array.from({ length: N + 1 }, (_, i) => 0);
        // Update dp[0] to 1
        dp[0] = 1;
        // Iterate over the range [1, K + 1]
        for (let row = 1; row < K + 1; row++) {
            // Iterate over the range [1, N + 1]
            for (let col = 1; col < N + 1; col++) {
                // If col is greater
                // than or equal to row
                if (col >= row)
                    // Update current
                    // dp[col] state
                    dp[col] = dp[col] + dp[col - row];
            }
        }
        // Return the total number of ways
        return (dp[N]);
    },
    tests(params) {
        [
            { params: 4, solution: 4 },
            { params: 19, solution: 489 },
            { params: 8, solution: 21 },
        ].forEach(t => {
            if (TotalWaysToSum.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return TotalWaysToSum.solve(params);
    },
    answer(params) { return TotalWaysToSum.tests(params); }
};
