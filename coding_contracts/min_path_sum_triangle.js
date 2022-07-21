// Given a triangle, find the minimum path sum from top to bottom. In each step
// of the path, you may only move to adjacent numbers in the row below.
// The triangle is represented as a 2D array of numbers:
export const MinPathSumTriangle = {
    solve(params) {
        // For storing the result
        // in a 1-D array, and
        // simultaneously updating
        // the result.
        let memo = [];
        let n = params.length - 1;
        // For the bottom row
        for (let i = 0; i < params[n].length; i++)
            memo[i] = params[n][i];
        // Calculation of the
        // remaining rows, in
        // bottom up manner.
        for (let i = params.length - 2; i >= 0; i--)
            for (let j = 0; j < params[i].length; j++)
                memo[j] = params[i][j] +
                    Math.min(memo[j], memo[j + 1]);
        // Return the
        // top element
        let solution = memo[0];
        return solution;
    },
    tests(params) {
        [
            { params: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]], solution: 11 },
            { params: [[-10]], solution: -10 },
            {
                params: [[3],
                    [9, 3],
                    [4, 4, 9],
                    [1, 2, 2, 7],
                    [8, 8, 9, 1, 9],
                    [9, 4, 4, 1, 4, 6],
                    [3, 6, 4, 5, 1, 3, 2],
                    [6, 9, 3, 3, 4, 8, 6, 6],
                    [5, 7, 6, 8, 4, 1, 4, 9, 5],
                    [8, 5, 9, 2, 7, 9, 3, 8, 1, 7],
                    [5, 3, 6, 2, 2, 4, 6, 3, 9, 5, 8]], solution: 26
            },
        ].forEach(t => {
            if (MinPathSumTriangle.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return MinPathSumTriangle.solve(params);
    },
    answer(params) { return MinPathSumTriangle.tests(params); }
};
