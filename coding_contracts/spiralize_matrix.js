// Given the following array of arrays of numbers representing a 2D matrix
// return the elements of the matrix as an array in spiral order.
export const SpiralizeMatrix = {
    solve(params) {
        var solution = [];
        while (params.length > 0) {
            solution.push(...params.shift());
            try {
                params = params[0].map((val, idx) => params.map(row => row[idx]).reverse()); // i only know how to rotate clockwise
                params = params[0].map((val, idx) => params.map(row => row[idx]).reverse()); // this solution wants it counterclockwise
                params = params[0].map((val, idx) => params.map(row => row[idx]).reverse()); // but three clockwise rotations is counter clockwise!
            }
            catch { }
        }
        return solution;
    },
    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    },
    tests(params) {
        [
            { params: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], solution: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
            { params: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], solution: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
            {
                params: [
                    [47, 42, 14, 23, 27, 4, 3, 49],
                    [7, 44, 39, 44, 30, 33, 40, 39],
                    [32, 4, 33, 28, 11, 6, 36, 1],
                    [15, 21, 44, 1, 10, 50, 40, 5],
                    [47, 47, 5, 16, 6, 33, 46, 28],
                    [23, 30, 10, 5, 8, 36, 4, 48],
                    [27, 15, 15, 7, 45, 2, 40, 48],
                    [38, 25, 47, 41, 17, 13, 22, 34]
                ], solution: [47, 42, 14, 23, 27, 4, 3, 49, 39, 1, 5, 28, 48, 48, 34, 22, 13, 17, 41, 47, 25, 38, 27, 23, 47, 15, 32, 7, 44, 39, 44, 30, 33, 40, 36, 40, 46, 4, 40, 2, 45, 7, 15, 15, 30, 47, 21, 4, 33, 28, 11, 6, 50, 33, 36, 8, 5, 10, 5, 44, 1, 10, 6, 16]
            },
        ].forEach(t => {
            if (!SpiralizeMatrix.arrayEquals(SpiralizeMatrix.solve(t.params), t.solution)) {
                throw "Test failed to pass";
            }
        });
        return SpiralizeMatrix.solve(params);
    },
    answer(params) { return SpiralizeMatrix.tests(params); }
};
