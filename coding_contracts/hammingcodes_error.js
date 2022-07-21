// You are given the following encoded binary String:
// '01011010'
// Treat it as a Hammingcode with 1 'possible' error on an random Index.
// Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.
// Note: The length of the binary string is dynamic, but it's encoding/decoding is following Hammings 'rule'
// Note 2: Index 0 is an 'overall' parity bit. Watch the Hammingcode-video from 3Blue1Brown for more information
// Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
// Extranote for automation: return the decimal value as a string
export const HammingDecode = {
    solve(params) {
        const array = Array.from(params);
        const error = array.reduce((a, b, i) => b === '1' ? a ^ i : a, 0);
        if (error)
            array[error] = array[error] === '1' ? '0' : '1';
        const decodedArray = [];
        for (const [i, b] of array.entries()) {
            if ((i & (i - 1)) === 0)
                continue;
            decodedArray.push(b);
        }
        return parseInt(decodedArray.join(''), 2).toString();
    },
    tests(params) {
        // [
        //     { params: '01011010', solution: '0100' },
        // ].forEach(t => {
        //     if (HammingDecode.solve(t.params) !== t.solution) { throw "Test failed to pass" }
        // })
        return HammingDecode.solve(params);
    },
    answer(params) { return HammingDecode.tests(params); }
};
