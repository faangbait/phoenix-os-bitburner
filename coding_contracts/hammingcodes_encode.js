// You are given the following decimal Value: 
// Convert it into a binary string and encode it as a 'Hamming-Code'. eg:
// Value 8 will result into binary '1000', which will be encoded
// with the pattern 'pppdpddd', where p is a paritybit and d a databit,
// or '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
// NOTE: You need an parity Bit on Index 0 as an 'overall'-paritybit. 
// NOTE 2: You should watch the HammingCode-video from 3Blue1Brown, which explains the 'rule' of encoding,
// including the first Index parity-bit mentioned on the first note.
// Now the only one rule for this encoding:
// It's not allowed to add additional leading '0's to the binary value
// That means, the binary value has to be encoded as it is
export const HammingEncode = {
    solve(params) {
        const array = Array.from(params.toString(2));
        const encodedArray = [];
        let i = 0;
        while (array.length > 0) {
            if ((i & (i - 1)) !== 0)
                encodedArray[i] = array.shift();
            i++;
        }
        const p = Math.ceil(Math.log2(encodedArray.length));
        for (i = 0; i < p; i++)
            encodedArray[2 ** i] = (encodedArray.filter((b, k) => b === '1' &&
                (k.toString(2).padStart(p, '0'))[p - i - 1] === '1').length % 2).toString();
        encodedArray[0] = (encodedArray.filter(b => b === '1').length % 2).toString();
        return encodedArray.join('');
    },
    tests(params) {
        // [
        //     { params: 8, solution: '1000' },
        //     { params: 21, solution: '1001101011' }
        // ].forEach(t => {
        //     if (HammingEncode.solve(t.params) !== t.solution) { throw "Test failed to pass" }
        // })
        return HammingEncode.solve(params);
    },
    answer(params) { return HammingEncode.tests(params); }
};
