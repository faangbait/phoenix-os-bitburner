// "Given the following integer array, find the contiguous subarray",
// "(containing at least one number) which has the largest sum and return that sum.",
// "'Sum' refers to the sum of all the numbers in the subarray.",
export const SubarrayMaxSum = {
    solve(params) {
        let maxSum = -Infinity;
        let currentSum = 0;
        // We need to keep track of the starting and ending indices that contributed to our maxSum
        // so that we can return the actual subarray. From the beginning let's assume that whole array
        // is contributing to maxSum.
        let maxStartIndex = 0;
        let maxEndIndex = params.length - 1;
        let currentStartIndex = 0;
        params.forEach((currentNumber, currentIndex) => {
            currentSum += currentNumber;
            // Update maxSum and the corresponding indices if we have found a new max.
            if (maxSum < currentSum) {
                maxSum = currentSum;
                maxStartIndex = currentStartIndex;
                maxEndIndex = currentIndex;
            }
            // Reset currentSum and currentStartIndex if currentSum drops below 0.
            if (currentSum < 0) {
                currentSum = 0;
                currentStartIndex = currentIndex + 1;
            }
        });
        let max = params.slice(maxStartIndex, maxEndIndex + 1);
        let solution = max.reduce((a, b) => a + b, 0);
        return solution;
    },
    tests(params) {
        [
            { params: [-2, 1, -3, 4, -1, 2, 1, -5, 4], solution: 6 },
            { params: [1], solution: 1 },
            { params: [5, 4, -1, 7, 8], solution: 23 },
        ].forEach(t => {
            if (SubarrayMaxSum.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return SubarrayMaxSum.solve(params);
    },
    answer(params) { return SubarrayMaxSum.tests(params); }
};
