// Given the following array of arrays of numbers representing a \n\n
// [[1, 3], [8, 10], [2, 6], [10, 16]]
// would merge into [[1, 6], [8, 16]].
// The intervals must be returned in ASCENDING order.
// You can assume that in an interval, the first number will always be smaller than the second.
export const MergeOverlapping = {
    solve(params) {
        params.sort((a, b) => a[0] - b[0]);
        const intervals = [params[0].slice()];
        for (let interval of params) {
            let [x1, y1] = interval;
            let [, y2] = intervals[intervals.length - 1];
            if (y2 >= x1)
                intervals[intervals.length - 1][1] = Math.max(y1, y2);
            else
                intervals.push(interval.slice());
        }
        return intervals;
    },
    // function arrayEquals(a: number[], b: number[]) {
    //     return Array.isArray(a) &&
    //       Array.isArray(b) &&
    //       a.length === b.length &&
    //       a.every((val, index) => val === b[index]);
    //   }
    tests(params) {
        // if (![
        //     { params: [[1, 3], [2, 6], [8, 10], [15, 18]], solution: [[1, 6], [8, 10], [15, 18]] },
        //     { params: [[1, 3], [8, 10], [2, 6], [10, 16]], solution: [[1, 6], [8, 16]] },
        //     { params: [[1, 4], [4, 5]], solution: [[1, 5]] },
        // ].every(t => {
        //     MergeOverlapping.solve(t.params).every(s => {
        //         t.solution.includes(s) && t.solution.length === MergeOverlapping.solve(t.params).length
        //     })
        // })) { throw "Tests failed to pass" }
        return MergeOverlapping.solve(params);
    },
    answer(params) { return MergeOverlapping.tests(params); }
};
