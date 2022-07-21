// remove the minimum number of invalid parentheses in order to validate
// the string. If there are multiple minimal ways to validate the string,
// provide all of the possible results. The answer should be provided
// as an array of strings. If it is impossible to validate the string
// the result should be an array with only an empty string.
// IMPORTANT: The string may contain letters, not just parentheses.
export const SanitizeParens = {
    solve(params) {
        const valid = new Set('');
        let min = params.length;
        for (let i = 0; i < 2 ** params.length; i++) {
            let j = i.toString(2);
            while (j.length < params.length) {
                j = '0' + j;
            }
            let str = '';
            let deletions = 0;
            for (let k = 0; k < j.length; k++) {
                if (j[k] === '1' || (params[k] !== '(' && params[k] !== ')'))
                    str += params[k];
                else
                    deletions++;
            }
            if (deletions > min)
                continue;
            let count = 0;
            let neg = false;
            for (let k of str) {
                if (k === '(')
                    count++;
                else if (k === ')')
                    count--;
                if (count < 0)
                    neg = true;
            }
            if (count > 0 || neg)
                continue;
            if (deletions === min)
                valid.add(str);
            else if (deletions < min) {
                min = deletions;
                valid.clear();
                valid.add(str);
            }
        }
        return [...valid];
    },
    tests(params) {
        // if (![
        //     { params: "()())()", solution: ["(())()", "()()()"] },
        //     { params: "(a)())()", solution: ["(a())()", "(a)()()"] },
        //     { params: ")(", solution: [""] }
        // ].every(t => {
        //     SanitizeParens.solve(t.params).every(s => {
        //         t.solution.includes(s) && t.solution.length === SanitizeParens.solve(t.params).length
        //     })
        // })) { throw "Tests failed to pass" }
        return SanitizeParens.solve(params);
    },
    answer(params) { return SanitizeParens.tests(params); }
};
