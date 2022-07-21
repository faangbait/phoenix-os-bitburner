// You are given the following string which contains only digits between 0 and 9:
// You are also given a target number of ${target}. Return all possible ways
// you can add the +(add), -(subtract), and *(multiply) operators to the string such
// that it evaluates to the target number. (Normal order of operations applies.)
// The provided answer should be an array of strings containing the valid expressions.
// The data provided by this problem is an array with two elements. The first element
// is the string of digits, while the second element is the target number:
// NOTE: The order of evaluation expects script operator precedence
// NOTE: Numbers in the expression cannot have leading 0's. In other words,
// "1+01" is not a valid expression
export const FindValidMath = {
    solve(params) {
        function recursiveExpression(res, path, digits, target, pos, evaluated, multed) {
            if (pos === digits.length) {
                if (target === evaluated)
                    res.push(path);
                return;
            }
            for (let i = pos; i < digits.length; i++) {
                if (i !== pos && digits[pos] === '0')
                    break;
                const cur = parseInt(digits.substring(pos, i + 1));
                if (pos === 0)
                    recursiveExpression(res, path + cur, digits, target, i + 1, cur, cur);
                else {
                    recursiveExpression(res, path + '+' + cur, digits, target, i + 1, evaluated + cur, cur);
                    recursiveExpression(res, path + '-' + cur, digits, target, i + 1, evaluated - cur, -cur);
                    recursiveExpression(res, path + '*' + cur, digits, target, i + 1, evaluated - multed + multed * cur, multed * cur);
                }
            }
        }
        const [digits, target] = params;
        const result = [];
        if (digits == null || digits.length === 0)
            return result;
        recursiveExpression(result, '', digits, target, 0, 0, 0);
        return result;
    },
    tests(params) {
        // if (![
        //     { params: ['123', 6], solution: ["1+2+3", "1*2*3"] },
        //     { params: ['105', 5], solution: ["1*0+5", "10-5"] },
        //     { params: ['232', 8], solution: ["2*3+2", "2+3*2"] }
        // ].every(t => {
        //     FindValidMath.solve(t.params as [string,number]).every(s => {
        //         t.solution.includes(s) && t.solution.length === FindValidMath.solve(t.params as [string,number]).length
        //     })
        // })) { throw "Tests failed to pass" }
        return FindValidMath.solve(params);
    },
    answer(params) { return FindValidMath.tests(params); }
};
