// You are given the following array of integers:
//
// Each element in the array represents your MAXIMUM jump length at that position. 
// This means that if you are at position i and your maximum jump length is n, 
// you can jump to any position from i to i+n.
//
// Assuming you are initially positioned at the start of the array, determine whether or not
// you can reach the end.
export const ArrayJumping1 = {
    solve(params) {
        return Jumping.solve(params).includes(Infinity) ? 0 : 1;
    },
    tests(params) {
        // if (![
        //     { params: [1,1,2,3,4], solution: true },
        //     { params: [1, 1, 2, 0, 1, 2, 2, 0], solution: true },
        // ].every(t => ArrayJumping1.solve(params) == t.solution)) { }
        return ArrayJumping1.solve(params);
    },
    answer(params) { return ArrayJumping1.tests(params); }
};
export const ArrayJumping2 = {
    solve(params) {
        let jumps = Jumping.solve(params);
        return jumps[jumps.length - 1] === Infinity ? 0 : jumps[jumps.length - 1];
    },
    tests(params) {
        // if (![
        //     { params: [1, 5, 1, 0, 1, 0, 4, 0, 0, 0, 1, 1], solution: 4 },
        //     { params: [0,0,5], solution: 0 },
        // ].every(t => ArrayJumping2.solve(params) == t.solution)) { }
        return ArrayJumping2.solve(params);
    },
    answer(params) { return ArrayJumping2.tests(params); }
};
const Jumping = {
    solve(params) {
        const reachable = new Array(params.length).fill(Infinity);
        reachable[0] = 0;
        for (let i = 0; i < params.length; i++) {
            let num = params[i];
            for (let j = 1; j <= num; j++) {
                if (i + j === params.length)
                    break;
                reachable[i + j] = Math.min(reachable[i + j], reachable[i] + 1);
            }
        }
        return reachable;
    }
};
