// A prime factor is a factor that is a prime number.
// What is the largest prime factor of ${n}?
export const FindLPF = {
    solve(params) {
        var x = 2;
        while (x <= params) {
            if (params % x == 0) {
                params /= x;
            }
            else {
                x++;
            }
        }
        let solution = x;
        return solution;
    },
    tests(params) {
        [
            { params: 5, solution: 5 },
            { params: 95, solution: 19 },
            { params: 602, solution: 43 },
            { params: 981, solution: 109 },
        ].forEach(t => {
            if (FindLPF.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return FindLPF.solve(params);
    },
    answer(params) { return FindLPF.tests(params); }
};
