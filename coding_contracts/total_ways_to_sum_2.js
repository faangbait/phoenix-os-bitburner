// How many different distinct ways can the number ${n} be written
// as a sum of integers contained in the set
// You may use each integer in the set zero or more times.
export const TotalWaysToSum2 = {
    solve(params) {
        const count = (S, m, n) => {
            let table = new Array(n + 1);
            table.fill(0);
            table[0] = 1;
            for (let i = 0; i < m; i++)
                for (let j = S[i]; j <= n; j++)
                    table[j] += table[j - S[i]];
            return table[n];
        };
        return count(params[1], params[0], params[0]);
    },
    tests(params) {
        [
            { params: [10, [2, 5, 8]], solution: 3 },
            { params: [4, [1, 2, 3]], solution: 4 },
            { params: [10, [2, 5, , 3, 6]], solution: 5 },
        ].forEach(t => {
            if (TotalWaysToSum2.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return TotalWaysToSum2.solve(params);
    },
    answer(params) { return TotalWaysToSum2.tests(params); }
};
